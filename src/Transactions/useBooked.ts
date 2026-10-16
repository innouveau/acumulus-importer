import { ref } from 'vue'
import { loadStore, saveStore } from '../storage/store'
import { RowStatus } from './Transaction/Actions/rowStatus.enum'
import type { Booked } from './booked.types'
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
    booked.value = { ...booked.value, [row.tx.key]: { type: row.type, entryid, at: new Date().toISOString() } }
    saveStore('booked', booked.value)
}

const unmarkDone = (row: Row) => {
    const { [row.tx.key]: _removed, ...rest } = booked.value
    booked.value = rest
    saveStore('booked', booked.value)
    row.status = RowStatus.Idle
    row.message = ''
}

export const useBooked = () => ({ booked, loadBooked, isDone, doneLabel, markDone, unmarkDone })
