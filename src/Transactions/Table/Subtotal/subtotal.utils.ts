import { Direction } from '../../Transaction/Amount/direction.enum'
import type { Row } from '../../Transaction/transaction.types'

// Af telt negatief, bij positief
export const subtotal = (rows: Row[]): number =>
    rows.reduce((sum, row) => sum + (row.tx.direction === Direction.Debit ? -row.tx.amount : row.tx.amount), 0)
