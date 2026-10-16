import { ref } from 'vue'
import { callAcumulus } from '../../../acumulus/client'
import { BookingType } from '../BookingType/bookingType.enum'
import { RowStatus } from './rowStatus.enum'
import type { Row } from '../transaction.types'
import { buildBookingRequest, type BookingIds } from './booking.utils'
import { useAcumulus } from '../../../acumulus/useAcumulus'
import { useBooked } from '../../useBooked'
import { useRules } from '../../../Rules/useRules'
import { useSettings } from '../../Upload/Account/useSettings'
import { useTransactions } from '../../useTransactions'

const { costHeadingId, costCenterId, accountId } = useAcumulus()
const { markDone } = useBooked()
const { findRule } = useRules()
const { settings } = useSettings()
const { selectedBookable, setSelected } = useTransactions()

// Standaard aan: Acumulus controleert alles maar boekt niets
const testmode = ref(true)

const fail = (row: Row, message: string) => {
    row.status = RowStatus.Error
    row.message = message
}

// Namen naar Acumulus-id's; zonder kostensoort-id valt Acumulus stilletjes terug op "Diversen"
const resolveIds = (row: Row): BookingIds | string => {
    const accountid = accountId(settings.value.account)
    if (!accountid) return `Rekening "${settings.value.account}" niet gevonden in Acumulus.`
    const costheadingid = costHeadingId(row.costheading)
    if (row.type === BookingType.Expense && !costheadingid) return `Kostensoort "${row.costheading}" niet gevonden in Acumulus.`
    const costcenterid = costCenterId(row.costcenter)
    if (!costcenterid) return `Kostenplaats "${row.costcenter}" niet gevonden in Acumulus.`
    return { accountid, costheadingid, costcenterid }
}

const successMessage = (entryid?: string) => (testmode.value ? 'Test geslaagd (niets geboekt)' : `Geboekt, boekstuk ${entryid ?? '?'}`)

const book = async (row: Row) => {
    const ids = resolveIds(row)
    if (typeof ids === 'string') return fail(row, ids)

    row.status = RowStatus.Busy
    row.message = ''
    const { resource, params } = buildBookingRequest(row, findRule(row.ruleId), ids)
    try {
        const result = await callAcumulus(resource, params, testmode.value)
        const entryid = ((result.data.expense ?? result.data.transfer) as { entryid?: string } | undefined)?.entryid
        row.status = result.ok ? RowStatus.Ok : RowStatus.Error
        row.message = [result.ok ? successMessage(entryid) : '', ...result.messages].filter(Boolean).join(' · ')
        if (result.ok && !testmode.value) {
            markDone(row, entryid)
            setSelected(row, false)
        }
    } catch (error) {
        fail(row, String(error))
    }
}

const bookSelected = async () => {
    for (const row of selectedBookable.value) {
        await book(row)
    }
}

export const useBooking = () => ({ testmode, book, bookSelected })
