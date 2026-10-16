<script setup lang="ts">
import { VAT_RATE_LABELS } from './vat.constants'
import { VatRate } from './vat.enum'
import { enumValues } from '../../../utils/enum'

defineProps<{ emptyLabel?: string }>()
const model = defineModel<VatRate | null>({ required: true })
const options = enumValues(VatRate)
</script>

<template>
    <select v-model="model" :class="{ missing: model === null && !emptyLabel }">
        <option :value="null">{{ emptyLabel ?? '— kies —' }}</option>
        <option v-for="option in options" :key="option" :value="option">{{ VAT_RATE_LABELS[option] }}</option>
    </select>
</template>
