import { Direction } from '../Transaction/Amount/direction.enum'
import { sumAmounts } from '../Transaction/Amount/amount.utils'
import type { Row } from '../Transaction/transaction.types'

// Over de hele import, los van selectie, tabje of zoekfilter
export const totalBalance = (rows: Row[]) => sumAmounts(rows)

export const totalIn = (rows: Row[]) => sumAmounts(rows.filter((row) => row.tx.direction === Direction.Credit))

export const totalOut = (rows: Row[]) => sumAmounts(rows.filter((row) => row.tx.direction === Direction.Debit))
