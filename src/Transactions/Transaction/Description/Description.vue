<script setup lang="ts">
import type { Row } from '../transaction.types'

defineProps<{ row: Row; disabled: boolean }>()
</script>

<template>
    <strong>{{ row.tx.counterparty }}</strong>
    <input v-model="row.description" class="desc-input" :disabled="disabled" />
</template>
