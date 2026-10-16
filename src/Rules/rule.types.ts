import type { BookingType } from '../Transactions/Transaction/BookingType/bookingType.enum'
import type { CostHeading } from '../Transactions/Transaction/CostHeading/costHeading.enum'
import type { RuleField } from './Rule/Field/ruleField.enum'
import type { VatRate, VatType } from '../Transactions/Transaction/Vat/vat.enum'

export interface Rule {
    id: string
    label: string
    // Komma-gescheiden zoektermen
    match: string
    // Standaard: zoeken in naam tegenpartij + omschrijving
    field?: RuleField
    type: BookingType
    costheading: CostHeading | ''
    // null = per transactie kiezen
    vatrate: VatRate | null
    vattype: VatType
    supplierCountry?: string
    supplierVatnumber?: string
    note: string
}
