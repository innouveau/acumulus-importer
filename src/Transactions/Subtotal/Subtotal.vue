<script setup lang="ts">
import { computed } from 'vue'
import { euro, sumAmounts } from '../Transaction/Amount/amount.utils'
import { useTransactions } from '../useTransactions'

const { visibleRows } = useTransactions()

// Alle rijen die nu zichtbaar zijn (tabje + zoekfilter), geselecteerd of niet
const total = computed(() => sumAmounts(visibleRows.value))
</script>

<template>
    <div class="subtotal-bar">
        <span class="muted">Subtotaal ({{ visibleRows.length }})</span>
        <strong :class="total < 0 ? 'out' : 'in'">{{ euro(total) }}</strong>
    </div>
</template>
