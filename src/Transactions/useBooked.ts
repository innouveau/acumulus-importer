import { ref } from 'vue'
import { loadStore, saveStore } from '../storage/store'
import { RowStatus } from './Transaction/Actions/rowStatus.enum'
import type { Booked } from './booked.types'
import { needsVatBackfill, vatSnapshot } from './booked.utils'
import { fetchBookedVat } from './bookedVat.api'
import type { Row } from './Transaction/transaction.types'

// Wat al geboekt of afgehandeld is, zodat niets dubbel gaat
const booked = ref<Booked>({})

const loadBooked = async () => {
    booked.value = (await loadStore<Booked>('booked')) ?? {}
}

const isDone = (row: Row) => Boolean(booked.value[row.tx.key])

const doneLabel = (row: Row) => {
    const entryid = booked.value[row.tx.key]?.entryid
    return entryid ? `#${entryid}` : 'gedaan'
}

const markDone = (row: Row, entryid?: string) => {
    booked.value = { ...booked.value, [row.tx.key]: { type: row.type, entryid, at: new Date().toISOString(), vat: vatSnapshot(row) } }
    saveStore('booked', booked.value)
}

const unmarkDone = (row: Row) => {
    const { [row.tx.key]: _removed, ...rest } = booked.value
    booked.value = rest
    saveStore('booked', booked.value)
    row.status = RowStatus.Idle
    row.message = ''
}

// Eenmalig: van eerder geboekte kosten de btw-instellingen uit Acumulus halen (één verzoek tegelijk)
const backfillBookedVat = async () => {
    let changed = false
    for (const [key, entry] of Object.entries(booked.value)) {
        if (!needsVatBackfill(entry)) continue
        const vat = await fetchBookedVat(entry.entryid!)
        if (!vat) continue
        booked.value = { ...booked.value, [key]: { ...entry, vat } }
        changed = true
    }
    if (changed) await saveStore('booked', booked.value)
}

export const useBooked = () => ({ booked, loadBooked, backfillBookedVat, isDone, doneLabel, markDone, unmarkDone })
