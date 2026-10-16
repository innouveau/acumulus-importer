<script setup lang="ts">
import { Account } from './account.enum'
import { enumValues } from '../../../utils/enum'

const model = defineModel<Account>({ required: true })
const options = enumValues(Account)
</script>

<template>
    <select v-model="model">
        <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
    </select>
</template>
