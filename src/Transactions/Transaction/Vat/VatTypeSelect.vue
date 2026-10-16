<script setup lang="ts">
import { VAT_TYPE_LABELS } from './vat.constants'
import { VatType } from './vat.enum'
import { enumValues } from '../../../utils/enum'

const model = defineModel<VatType>({ required: true })
const options = enumValues(VatType)
</script>

<template>
    <select v-model="model">
        <option v-for="option in options" :key="option" :value="option">{{ VAT_TYPE_LABELS[option] }}</option>
    </select>
</template>
