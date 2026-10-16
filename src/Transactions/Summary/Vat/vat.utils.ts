import { BookingType } from '../../Transaction/BookingType/bookingType.enum'
import { signedAmount } from '../../Transaction/Amount/amount.utils'
import type { Row } from '../../Transaction/transaction.types'
import { VatType } from '../../Transaction/Vat/vat.enum'
import type { Period } from '../../Upload/Period/period.utils'
import type { SalesInvoice } from './vat.types'

const round = (value: number) => Math.round(value * 100) / 100

// Btw-deel van een bedrag inclusief btw
const vatPart = (amountInclVat: number, rate: number) => (amountInclVat * rate) / (100 + rate)

// Btw op verkoopfacturen (op factuurdatum, dus ongeacht wanneer ze betaald zijn)
export const salesVat = (invoices: SalesInvoice[]) =>
    round(invoices.reduce((sum, invoice) => sum + invoice.totalValue - invoice.totalValueExclVat, 0))

// Aftrekbare btw op kosten uit de CSV; verlegde btw is verschuldigd én aftrekbaar en valt dus weg
const hasDeductibleVat = (row: Row) =>
    row.type === BookingType.Expense && row.vattype === VatType.National && row.vatrate !== null && row.vatrate > 0

const inPeriod = (row: Row, period: Period) => row.tx.date >= period.startdate && row.tx.date <= period.enddate

export const inputVat = (rows: Row[], period: Period) =>
    round(rows.filter((row) => inPeriod(row, period) && hasDeductibleVat(row)).reduce((sum, row) => sum + vatPart(-signedAmount(row.tx), row.vatrate!), 0))

// Kosten waarvan het btw-tarief nog niet gekozen is, tellen (nog) niet mee
export const missingVatCount = (rows: Row[], period: Period) =>
    rows.filter((row) => inPeriod(row, period) && row.type === BookingType.Expense && row.vatrate === null).length
