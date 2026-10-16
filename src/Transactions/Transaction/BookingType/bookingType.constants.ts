import { BookingType } from './bookingType.enum'

export const BOOKING_TYPE_LABELS: Record<BookingType, string> = {
    [BookingType.Expense]: 'Kosten (zakelijk)',
    [BookingType.Private]: 'Privé-boeking',
    [BookingType.Manual]: 'Handmatig in Acumulus',
    [BookingType.Ignore]: 'Negeren',
}
