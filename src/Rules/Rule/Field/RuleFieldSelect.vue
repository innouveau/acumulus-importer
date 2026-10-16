<script setup lang="ts">
import { RULE_FIELD_LABELS } from './ruleField.constants'
import { RuleField } from './ruleField.enum'

// undefined = standaard (naam + omschrijving)
const model = defineModel<RuleField | undefined>({ required: true })
</script>

<template>
    <select v-model="model">
        <option :value="undefined">{{ RULE_FIELD_LABELS[RuleField.All] }}</option>
        <option :value="RuleField.Counterparty">{{ RULE_FIELD_LABELS[RuleField.Counterparty] }}</option>
    </select>
</template>
