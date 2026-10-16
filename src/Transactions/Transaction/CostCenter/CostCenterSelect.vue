<script setup lang="ts">
import { CostCenter } from './costCenter.enum'
import { enumValues } from '../../../utils/enum'

const model = defineModel<CostCenter>({ required: true })
const options = enumValues(CostCenter)
</script>

<template>
    <select v-model="model">
        <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
    </select>
</template>
