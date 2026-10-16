import type { Row } from '../../Transaction/transaction.types'
import { normalize } from '../../../utils/text'

// Zoekt in tegenpartij, originele omschrijving en de (aangepaste) boekingsomschrijving
export const matchesSearch = (row: Row, query: string): boolean => {
    const term = normalize(query)
    if (!term) return true
    return normalize(`${row.tx.counterparty} ${row.tx.description} ${row.description}`).includes(term)
}
