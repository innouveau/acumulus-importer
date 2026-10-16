import type { BookingType } from './BookingType/bookingType.enum'
import type { Category } from '../CategoryTabs/category.enum'
import type { CostCenter } from './CostCenter/costCenter.enum'
import type { CostHeading } from './CostHeading/costHeading.enum'
import type { Direction } from './Amount/direction.enum'
import type { RowStatus } from './Actions/rowStatus.enum'
import type { UnpaidInvoice } from './Invoice/invoice.types'
import type { VatRate, VatType } from './Vat/vat.enum'

export interface Transaction {
    key: string
    date: string
    amount: number
    direction: Direction
    counterparty: string
    counterpartyAccount: string
    description: string
    // Originele CSV-velden, om ongewijzigd terug te exporteren
    raw: string[]
}

export interface Row {
    tx: Transaction
    category: Category
    ruleId: string | null
    type: BookingType
    costheading: CostHeading | ''
    costcenter: CostCenter
    vatrate: VatRate | null
    vattype: VatType
    // Activeren en afschrijven in plaats van in één keer als kosten
    investment: boolean
    writeOffYears: number
    // Gekoppelde verkoopfactuur bij een binnenkomende betaling
    invoice: UnpaidInvoice | null
    description: string
    status: RowStatus
    message: string
}
