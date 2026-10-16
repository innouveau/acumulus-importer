import { RuleField } from './ruleField.enum'

export const RULE_FIELD_LABELS: Record<RuleField, string> = {
    [RuleField.All]: 'Naam + omschrijving',
    [RuleField.Counterparty]: 'Alleen naam',
}
