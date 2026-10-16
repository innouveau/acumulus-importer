import type { Row, Transaction } from '../transaction.types'
import { Direction } from './direction.enum'

export const euro = (value: number): string => {
    return value.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })
}

// Af telt negatief, bij positief
export const signedAmount = (tx: Transaction): number => (tx.direction === Direction.Debit ? -tx.amount : tx.amount)

export const sumAmounts = (rows: Row[]): number => rows.reduce((sum, row) => sum + signedAmount(row.tx), 0)
