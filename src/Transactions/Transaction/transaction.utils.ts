import { DEFAULT_VAT_RATE, DEFAULT_VAT_TYPE } from './Vat/vat.constants'
import { BookingType } from './BookingType/bookingType.enum'
import { Category } from '../CategoryTabs/category.enum'
import { CostCenter } from './CostCenter/costCenter.enum'
import { Direction } from './Amount/direction.enum'
import { RowStatus } from './Actions/rowStatus.enum'
import type { Row, Transaction } from './transaction.types'
import type { Rule } from '../../Rules/rule.types'
import { normalize } from '../../utils/text'

const DESCRIPTION_MAX = 200
const TAX_AUTHORITY = 'belastingdienst'

// Ingedeeld bij het inlezen, zodat een rij niet van tab wisselt als je hem aanpast
export const categorize = (tx: Transaction, rule: Rule | undefined): Category => {
    if (tx.direction === Direction.Credit) return Category.Sales
    if (normalize(`${tx.counterparty} ${tx.description}`).includes(TAX_AUTHORITY)) return Category.Vat
    return rule ? Category.Normal : Category.Purchase
}

export const applyRule = (row: Row, rule: Rule | undefined): void => {
    row.ruleId = rule?.id ?? null
    row.type = rule?.type ?? BookingType.Manual
    row.costheading = rule?.costheading ?? ''
    row.vatrate = rule?.vatrate ?? null
    row.vattype = rule?.vattype ?? DEFAULT_VAT_TYPE
}

export const createRow = (tx: Transaction, rule: Rule | undefined): Row => {
    const row: Row = {
        tx,
        category: categorize(tx, rule),
        ruleId: null,
        type: BookingType.Manual,
        costheading: '',
        costcenter: CostCenter.Algemeen,
        vatrate: null,
        vattype: DEFAULT_VAT_TYPE,
        description: [tx.counterparty, tx.description].filter(Boolean).join(' – ').slice(0, DESCRIPTION_MAX),
        status: RowStatus.Idle,
        message: '',
    }
    applyRule(row, rule)
    if (row.category === Category.Purchase) {
        // Losse inkomende factuur: als kosten boeken, kostensoort zelf kiezen
        row.type = BookingType.Expense
        row.vatrate = DEFAULT_VAT_RATE
    }
    return row
}

export const isBookable = (row: Row): boolean => {
    if (row.type === BookingType.Expense) return Boolean(row.costheading) && row.vatrate !== null
    return row.type === BookingType.Private
}

export const hasCostCenter = (row: Row): boolean => {
    return row.type === BookingType.Expense || row.type === BookingType.Private
}
