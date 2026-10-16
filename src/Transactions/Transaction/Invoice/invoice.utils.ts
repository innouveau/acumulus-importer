import { normalize } from '../../../utils/text'
import type { Transaction } from '../transaction.types'
import { AMOUNT_TOLERANCE, MATCH_WEIGHTS, SEQUENCE_DIGITS } from './invoice.constants'
import type { UnpaidInvoice } from './invoice.types'

const tokens = (text: string) => normalize(text).split(/[\s,;:]+/).filter(Boolean)

// "2026-422" -> "20260422"; anders alleen de cijfers
export const canonicalNumber = (value: string) => {
    const yearAndSequence = value.trim().match(/^(\d{4})[-/.](\d+)$/)
    if (yearAndSequence) return yearAndSequence[1] + yearAndSequence[2].padStart(SEQUENCE_DIGITS, '0')
    return value.replace(/\D/g, '')
}

// Factuurnummer komt als los woord voor in de omschrijving ("2026-42" matcht dus niet "2026-422")
export const numberMatches = (invoice: UnpaidInvoice, tx: Transaction) => {
    const number = canonicalNumber(invoice.number)
    return Boolean(number) && tokens(tx.description).some((token) => canonicalNumber(token) === number)
}

export const amountMatches = (invoice: UnpaidInvoice, tx: Transaction) => Math.abs(invoice.amount - tx.amount) < AMOUNT_TOLERANCE

export const nameMatches = (invoice: UnpaidInvoice, tx: Transaction) => {
    const name = normalize(invoice.contactname)
    const counterparty = normalize(tx.counterparty)
    return Boolean(name && counterparty) && (name.includes(counterparty) || counterparty.includes(name))
}

export const matchScore = (invoice: UnpaidInvoice, tx: Transaction) =>
    (numberMatches(invoice, tx) ? MATCH_WEIGHTS.number : 0) +
    (amountMatches(invoice, tx) ? MATCH_WEIGHTS.amount : 0) +
    (nameMatches(invoice, tx) ? MATCH_WEIGHTS.name : 0)

// Zeker genoeg om automatisch te koppelen: nummer én bedrag kloppen
export const isStrongMatch = (invoice: UnpaidInvoice, tx: Transaction) => numberMatches(invoice, tx) && amountMatches(invoice, tx)

export const sortBySuggestion = (invoices: UnpaidInvoice[], tx: Transaction) =>
    [...invoices].sort((a, b) => matchScore(b, tx) - matchScore(a, tx) || b.issuedate.localeCompare(a.issuedate))

export const invoiceLabel = (invoice: UnpaidInvoice) => `${invoice.number} · ${invoice.contactname}`
