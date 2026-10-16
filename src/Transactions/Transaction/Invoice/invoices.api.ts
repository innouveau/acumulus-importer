import { RESOURCES } from '../../../acumulus/acumulus.constants'
import { asList } from '../../../acumulus/acumulus.utils'
import { callAcumulus } from '../../../acumulus/client'
import { INCLUDE_ALL_DUE } from './invoice.constants'
import type { UnpaidInvoice } from './invoice.types'

type RawInvoice = Record<string, unknown>

const text = (value: unknown) => (typeof value === 'string' || typeof value === 'number' ? String(value) : '')

const toInvoice = (raw: RawInvoice): UnpaidInvoice => ({
    entryid: text(raw.entryid),
    token: text(raw.token),
    number: text(raw.number),
    issuedate: text(raw.issuedate),
    contactname: text(raw.contactname),
    invoicenote: text(raw.invoicenote),
    amount: Number(raw.amount) || 0,
})

export const fetchUnpaidInvoices = async (): Promise<{ invoices: UnpaidInvoice[]; messages: string[] }> => {
    const result = await callAcumulus(RESOURCES.unpaidDebtors, { due: INCLUDE_ALL_DUE })
    const container = result.data.unpaiddebtorinvoices as Record<string, unknown> | undefined
    return { invoices: asList<RawInvoice>(container?.entry).map(toInvoice), messages: result.messages }
}
