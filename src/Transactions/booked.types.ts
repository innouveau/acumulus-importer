import type { BookingType } from './Transaction/BookingType/bookingType.enum'
import type { CostHeading } from './Transaction/CostHeading/costHeading.enum'
import type { VatRate, VatType } from './Transaction/Vat/vat.enum'

// Hoe een kostenpost geboekt is, zodat de btw-berekening dat na opnieuw inlezen nog weet
export interface BookedVat {
    vatrate: VatRate | null
    vattype: VatType
    costheading?: CostHeading | ''
}

export interface BookedEntry {
    type: BookingType
    entryid?: string
    at: string
    vat?: BookedVat
}

export type Booked = Record<string, BookedEntry>
