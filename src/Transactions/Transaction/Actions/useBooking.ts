import { ref } from 'vue'
import { callAcumulus } from '../../../acumulus/client'
import { BookingType } from '../BookingType/bookingType.enum'
import { RowStatus } from './rowStatus.enum'
import type { Row } from '../transaction.types'
import { buildBookingRequest, invoicePayment, type BookingIds } from './booking.utils'
import type { BookingRequest } from '../../../acumulus/acumulus.types'
import { useAcumulus } from '../../../acumulus/useAcumulus'
import { useBooked } from '../../useBooked'
import { useRules } from '../../../Rules/useRules'
import { useSettings } from '../../Upload/Account/useSettings'
import { useTransactions } from '../../useTransactions'

const { costHeadingId, costCenterId, accountId, accountNames, costCenterNames } = useAcumulus()
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
const notFound = (label: string, name: string, known: string[]) =>
    `${label} "${name}" niet gevonden in Acumulus. Bekend: ${known.join(', ') || 'geen'}.`

const resolveIds = (row: Row): BookingIds | string => {
    const accountid = accountId(settings.value.account)
    if (!accountid) return notFound('Rekening', settings.value.account, accountNames())
    const costheadingid = costHeadingId(row.costheading)
    if (row.type === BookingType.Expense && !costheadingid) return `Kostensoort "${row.costheading}" niet gevonden in Acumulus.`
    const costcenterid = costCenterId(row.costcenter)
    if (!costcenterid) return notFound('Kostenplaats', row.costcenter, costCenterNames())
    return { accountid, costheadingid, costcenterid }
}

const successMessage = (entryid?: string) => (testmode.value ? 'Test geslaagd (niets geboekt)' : `Geboekt op ${entryid ?? '?'}`)

// Factuurbetaling heeft geen rekening/kostensoort nodig; de rest wel
const buildRequest = (row: Row): BookingRequest | string => {
    if (row.type === BookingType.InvoicePayment) return invoicePayment(row)
    const ids = resolveIds(row)
    return typeof ids === 'string' ? ids : buildBookingRequest(row, findRule(row.ruleId), ids)
}

const entryIdFrom = (data: Record<string, unknown>, row: Row) => {
    const entry = (data.expense ?? data.transfer ?? data.invoice) as { entryid?: unknown } | undefined
    const entryid = typeof entry?.entryid === 'string' || typeof entry?.entryid === 'number' ? String(entry.entryid) : ''
    return entryid || row.invoice?.entryid || undefined
}

// Geeft true terug als het gelukt is
const book = async (row: Row): Promise<boolean> => {
    const request = buildRequest(row)
    if (typeof request === 'string') {
        fail(row, request)
        return false
    }

    row.status = RowStatus.Busy
    row.message = ''
    const { resource, params } = request
    try {
        const result = await callAcumulus(resource, params, testmode.value)
        const entryid = entryIdFrom(result.data, row)
        row.status = result.ok ? RowStatus.Ok : RowStatus.Error
        row.message = [result.ok ? successMessage(entryid) : '', ...result.messages].filter(Boolean).join(' · ')
        if (result.ok && !testmode.value) {
            markDone(row, entryid)
            setSelected(row, false)
        }
        return result.ok
    } catch (error) {
        fail(row, String(error))
        return false
    }
}

const bookSelected = async () => {
    for (const row of selectedBookable.value) {
        await book(row)
    }
}

export const useBooking = () => ({ testmode, book, bookSelected })
