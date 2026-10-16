import { DEFAULT_COUNTRY, RESOURCES } from '../../../acumulus/acumulus.constants'
import { BookingType } from '../BookingType/bookingType.enum'
import { Direction } from '../Amount/direction.enum'
import { PaymentStatus, Polarity, SupplierType } from '../../../acumulus/acumulus.enum'
import type { BookingRequest } from '../../../acumulus/acumulus.types'
import type { Row } from '../transaction.types'
import type { Rule } from '../../../Rules/rule.types'

export interface BookingIds {
    accountid: number
    costheadingid: string
    costcenterid: string
}

const privateTransfer = (row: Row, ids: BookingIds): BookingRequest => {
    const { tx } = row
    return {
        resource: RESOURCES.addPrivateTransfer,
        params: {
            accountid: ids.accountid,
            costcenterid: ids.costcenterid,
            date: tx.date,
            description: row.description,
            amount: tx.amount.toFixed(2),
            polarity: tx.direction === Direction.Debit ? Polarity.Deduct : Polarity.Add,
        },
    }
}

// Investering: activeren en afschrijven; terugkerende boekingen zijn dan niet toegestaan
const investmentParams = (row: Row) =>
    row.investment ? { investment: 1, writeoffinyears: row.writeOffYears, recurrences: 0, monthly: 0 } : { investment: 0 }

const expense = (row: Row, rule: Rule | undefined, ids: BookingIds): BookingRequest => {
    const { tx } = row
    // Terugbetaling (bij) = negatieve kosten
    const amount = tx.direction === Direction.Debit ? tx.amount : -tx.amount
    return {
        resource: RESOURCES.addExpense,
        params: {
            supplier: {
                type: SupplierType.Creditor,
                companyname1: tx.counterparty || rule?.label || row.description,
                countrycode: rule?.supplierCountry || DEFAULT_COUNTRY,
                vatnumber: rule?.supplierVatnumber,
                bankaccountnumber: tx.counterpartyAccount,
                expense: {
                    description: row.description,
                    amountinclvat: amount.toFixed(2),
                    vatrate: row.vatrate,
                    vattype: row.vattype,
                    issuedate: tx.date,
                    costheading: ids.costheadingid,
                    costcenter: ids.costcenterid,
                    accountnumber: ids.accountid,
                    paymentstatus: PaymentStatus.Paid,
                    paymentdate: tx.date,
                    ...investmentParams(row),
                },
            },
        },
    }
}

export const buildBookingRequest = (row: Row, rule: Rule | undefined, ids: BookingIds): BookingRequest => {
    return row.type === BookingType.Private ? privateTransfer(row, ids) : expense(row, rule, ids)
}
