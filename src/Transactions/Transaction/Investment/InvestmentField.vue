<script setup lang="ts">
import type { Row } from '../transaction.types'
import { MAX_WRITE_OFF_YEARS, MIN_WRITE_OFF_YEARS } from './investment.constants'

defineProps<{ row: Row; disabled: boolean }>()
</script>

<template>
    <label class="nowrap">
        <input v-model="row.investment" type="checkbox" :disabled="disabled" />
        Investering
    </label>
    <label v-if="row.investment" class="nowrap investment-years">
        <input
            v-model.number="row.writeOffYears"
            type="number"
            class="short"
            :min="MIN_WRITE_OFF_YEARS"
            :max="MAX_WRITE_OFF_YEARS"
            :disabled="disabled"
        />
        jaar afschrijven
    </label>
</template>
