import { BookingType } from '../Transactions/Transaction/BookingType/bookingType.enum'
import { RuleField } from './Rule/Field/ruleField.enum'
import { VatRate, VatType } from '../Transactions/Transaction/Vat/vat.enum'
import type { Rule } from './rule.types'
import type { Transaction } from '../Transactions/Transaction/transaction.types'
import { normalize } from '../utils/text'

export const ruleMatches = (rule: Rule, tx: Transaction): boolean => {
    const haystack = normalize(rule.field === RuleField.Counterparty ? tx.counterparty : `${tx.counterparty} ${tx.description}`)
    return rule.match
        .split(',')
        .map(normalize)
        .filter(Boolean)
        .some((term) => haystack.includes(term))
}

export const findMatchingRule = (rules: Rule[], tx: Transaction): Rule | undefined => {
    return rules.find((rule) => ruleMatches(rule, tx))
}

export const createRule = (): Rule => {
    return {
        id: `regel-${Date.now()}`,
        label: 'Nieuwe regel',
        match: '',
        type: BookingType.Expense,
        costheading: '',
        vatrate: VatRate.High,
        vattype: VatType.National,
        note: '',
    }
}
