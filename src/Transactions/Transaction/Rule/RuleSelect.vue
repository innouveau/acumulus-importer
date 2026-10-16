<script setup lang="ts">
import { computed } from 'vue'
import { useRules } from '../../../Rules/useRules'
import type { Row } from '../transaction.types'
import { applyRule } from '../transaction.utils'

const props = defineProps<{ row: Row; disabled: boolean }>()
const { rules, findRule } = useRules()

const note = computed(() => findRule(props.row.ruleId)?.note ?? '')

const onChange = (event: Event) => {
    applyRule(props.row, findRule((event.target as HTMLSelectElement).value))
}
</script>

<template>
    <select :value="row.ruleId ?? ''" :disabled="disabled" @change="onChange">
        <option value="">— geen —</option>
        <option v-for="rule in rules" :key="rule.id" :value="rule.id">{{ rule.label }}</option>
    </select>
    <div v-if="note" class="note">{{ note }}</div>
</template>
