import Papa from 'papaparse'
import type { Row } from '../../Transaction/transaction.types'

// Zelfde formaat als de Triodos-export: alle velden tussen aanhalingstekens, geen kopregel
export const buildCsv = (rows: Row[], linebreak: string): string =>
    Papa.unparse(
        rows.map((row) => row.tx.raw),
        { quotes: true, newline: linebreak },
    ) + linebreak

// mutations2026.csv -> mutations2026-rest.csv
export const exportFileName = (original: string) => original.replace(/(\.csv)?$/i, '-rest.csv')

export const downloadCsv = (name: string, content: string) => {
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
    const link = Object.assign(document.createElement('a'), { href: url, download: name })
    link.click()
    URL.revokeObjectURL(url)
}
