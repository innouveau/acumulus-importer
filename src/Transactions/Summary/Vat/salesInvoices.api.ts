import { RESOURCES } from '../../../acumulus/acumulus.constants'
import { asList } from '../../../acumulus/acumulus.utils'
import { callAcumulus } from '../../../acumulus/client'
import { mapLimit } from '../../../utils/async'
import type { Period } from '../../Upload/Period/period.utils'
import { INVOICE_CONTACT_TYPES, REQUEST_CONCURRENCY } from './vat.constants'
import type { SalesInvoice } from './vat.types'

type Raw = Record<string, unknown>

// Een mislukt verzoek mag niet stilletjes als "geen facturen" tellen
const call = async (resource: string, params: Record<string, unknown>) => {
    const result = await callAcumulus(resource, params)
    if (!result.ok) throw new Error(result.messages.join(' · ') || `Acumulus-fout bij ${resource}`)
    return result
}

const text = (value: unknown) => (typeof value === 'string' || typeof value === 'number' ? String(value) : '')

// Acumulus geeft een leeg veld als {}; een gevulde "deleted" betekent een verwijderde boeking
const isDeleted = (entry: Raw) => text(entry.deleted) !== ''

const fetchContactIds = async () => {
    const result = await call(RESOURCES.contacts, { contacttype: INVOICE_CONTACT_TYPES })
    const container = result.data.contacts as Raw | undefined
    return asList<Raw>(container?.contact).map((contact) => text(contact.contactid))
}

const fetchInvoiceEntryIds = async (contactid: string, period: Period) => {
    const result = await call(RESOURCES.contactInvoicesOutgoing, { contactid })
    const contact = result.data.contact as Raw | undefined
    return asList<Raw>(contact?.invoice)
        .filter((invoice) => text(invoice.entrydate) >= period.startdate && text(invoice.entrydate) <= period.enddate)
        .map((invoice) => text(invoice.entryid))
}

const fetchInvoice = async (entryid: string): Promise<SalesInvoice | null> => {
    const result = await call(RESOURCES.entryInfo, { entryid })
    const entry = result.data.entry as Raw | undefined
    if (!entry || isDeleted(entry)) return null
    return {
        entryid,
        number: text(entry.invoicenumber),
        date: text(entry.entrydate),
        totalValue: Number(entry.totalvalue) || 0,
        totalValueExclVat: Number(entry.totalvalueexclvat) || 0,
    }
}

// Er is geen "facturen per periode"-aanroep: per contact de facturen ophalen, op datum filteren en de details opvragen
export const fetchSalesInvoices = async (period: Period): Promise<SalesInvoice[]> => {
    const contactIds = await fetchContactIds()
    const entryIds = (await mapLimit(contactIds, REQUEST_CONCURRENCY, (id) => fetchInvoiceEntryIds(id, period))).flat()
    const invoices = await mapLimit(entryIds, REQUEST_CONCURRENCY, fetchInvoice)
    return invoices.filter((invoice): invoice is SalesInvoice => invoice !== null)
}
