<script setup lang="ts">
import { useTransactions } from '../../useTransactions'
import type { Row } from '../transaction.types'
import { isBookable } from '../transaction.utils'

defineProps<{ row: Row; disabled: boolean }>()
const { isSelected, setSelected } = useTransactions()
</script>

<template>
    <input
        type="checkbox"
        :checked="isSelected(row)"
        :disabled="disabled || !isBookable(row)"
        @change="setSelected(row, ($event.target as HTMLInputElement).checked)"
    />
</template>
