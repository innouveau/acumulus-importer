import Papa from 'papaparse'
import { Direction } from '../Transaction/Amount/direction.enum'
import type { Transaction } from '../Transaction/transaction.types'

// Vaste kolomvolgorde van de Triodos-export (zonder kopregel):
// datum, eigen rekening, bedrag, Debet/Credit, naam tegenpartij, "BIC IBAN" tegenpartij, code, omschrijving, saldo
const COL = { date: 0, amount: 2, direction: 3, counterparty: 4, counterpartyAccount: 5, description: 7, balance: 8 }
const DATE_PATTERN = /^\d{2}-\d{2}-\d{4}$/

// 1.234,56 -> 1234.56
const parseAmount = (value: string): number => {
    return Number(value.replace(/\./g, '').replace(',', '.'))
}

// 01-07-2026 -> 2026-07-01
const parseDate = (value: string): string => {
    const [day, month, year] = value.split('-')
    return `${year}-${month}-${day}`
}

const toTransaction = (row: string[]): Transaction => {
    const cell = (index: number) => (row[index] ?? '').trim()
    const tx: Transaction = {
        key: '',
        date: parseDate(cell(COL.date)),
        amount: parseAmount(cell(COL.amount)),
        direction: cell(COL.direction).toLowerCase() === 'credit' ? Direction.Credit : Direction.Debit,
        counterparty: cell(COL.counterparty),
        // "INGBNL2A NL89INGB0005138060" -> alleen de IBAN
        counterpartyAccount: cell(COL.counterpartyAccount).split(/\s+/).pop() ?? '',
        description: cell(COL.description).replace(/\s+/g, ' '),
        raw: row,
    }
    // Saldo erbij, zodat twee gelijke transacties op dezelfde dag toch uniek zijn
    tx.key = [tx.date, tx.direction, tx.amount.toFixed(2), tx.counterparty, tx.description, cell(COL.balance)].join('|')
    return tx
}

export interface ParsedCsv {
    transactions: Transaction[]
    // Regeleinde van het bestand, zodat een export hetzelfde formaat heeft
    linebreak: string
}

export const parseTriodosCsv = (text: string): ParsedCsv => {
    const result = Papa.parse<string[]>(text.trim(), { skipEmptyLines: true })
    return {
        transactions: result.data.filter((row) => DATE_PATTERN.test(row[COL.date]?.trim() ?? '')).map(toTransaction),
        linebreak: result.meta.linebreak || '\n',
    }
}
