<script setup lang="ts">
import { computed } from 'vue'
import type { Transaction } from '../transaction.types'
import { euro } from './amount.utils'
import { Direction } from './direction.enum'

const props = defineProps<{ tx: Transaction }>()
const isDebit = computed(() => props.tx.direction === Direction.Debit)
</script>

<template>
    <span :class="isDebit ? 'out' : 'in'">{{ isDebit ? '−' : '+' }}{{ euro(tx.amount) }}</span>
</template>
