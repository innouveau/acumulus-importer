import type { BookingType } from './Transaction/BookingType/bookingType.enum'

export interface BookedEntry {
    type: BookingType
    entryid?: string
    at: string
}

export type Booked = Record<string, BookedEntry>
