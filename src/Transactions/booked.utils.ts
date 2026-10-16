import type { BookedEntry, BookedVat } from './booked.types'
import { BookingType } from './Transaction/BookingType/bookingType.enum'
import type { Row } from './Transaction/transaction.types'

export const vatSnapshot = (row: Row): BookedVat | undefined =>
    row.type === BookingType.Expense ? { vatrate: row.vatrate, vattype: row.vattype, costheading: row.costheading } : undefined

// Zet de geboekte btw-instellingen terug op een (opnieuw ingelezen) rij
export const restoreBookedVat = (row: Row, entry: BookedEntry | undefined) => {
    if (!entry?.vat) return
    row.type = entry.type
    row.vatrate = entry.vat.vatrate
    row.vattype = entry.vat.vattype
    if (entry.vat.costheading) row.costheading = entry.vat.costheading
}

// Geboekte kosten van vóór het opslaan van btw-instellingen
export const needsVatBackfill = (entry: BookedEntry) => entry.type === BookingType.Expense && Boolean(entry.entryid) && !entry.vat
