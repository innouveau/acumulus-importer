<script setup lang="ts">
import { computed } from 'vue'
import { euro } from '../Transaction/Amount/amount.utils'
import { useTransactions } from '../useTransactions'
import { totalBalance, totalIn, totalOut } from './summary.utils'
import VatBalance from './Vat/VatBalance.vue'

const { rows } = useTransactions()

const stats = computed(() => [
    { label: 'Totaal bij deze periode', hint: 'alle ontvangsten', value: totalIn(rows.value) },
    { label: 'Totaal af deze periode', hint: 'alle uitgaven', value: totalOut(rows.value) },
    { label: 'Totaal saldo', hint: 'bij − af', value: totalBalance(rows.value) },
])
</script>

<template>
    <section class="card summary">
        <h2>Overzicht import</h2>
        <div class="summary-stats">
            <div v-for="stat in stats" :key="stat.label" class="stat">
                <span class="muted">{{ stat.label }}</span>
                <strong :class="stat.value < 0 ? 'out' : 'in'">{{ euro(stat.value) }}</strong>
                <span class="stat-hint">{{ stat.hint }}</span>
            </div>
            <VatBalance />
        </div>
    </section>
</template>
