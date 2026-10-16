<script setup lang="ts">
import { computed } from 'vue'
import { euro } from '../Transaction/Amount/amount.utils'
import { useTransactions } from '../useTransactions'
import { totalBalance, totalIn, totalOut } from './summary.utils'
import VatBalance from './Vat/VatBalance.vue'
import VatCheck from './Vat/VatCheck.vue'

const { rows } = useTransactions()

const stats = computed(() => [
    { label: 'Totaal bij deze periode', value: totalIn(rows.value) },
    { label: 'Totaal af deze periode', value: totalOut(rows.value) },
    { label: 'Totaal saldo', value: totalBalance(rows.value) },
])
</script>

<template>
    <section class="card summary">
        <div class="summary-stats">
            <div v-for="stat in stats" :key="stat.label" class="stat">
                <span class="muted">{{ stat.label }}</span>
                <strong :class="stat.value < 0 ? 'out' : 'in'">{{ euro(stat.value) }}</strong>
            </div>
            <VatBalance />
            <VatCheck />
        </div>
    </section>
</template>
