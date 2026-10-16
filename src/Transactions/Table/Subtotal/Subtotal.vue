<script setup lang="ts">
import { computed } from 'vue'
import { euro, sumAmounts } from '../../Transaction/Amount/amount.utils'
import { useTransactions } from '../../useTransactions'
import { AMOUNT_COLUMN, TRANSACTION_COLUMNS } from '../table.constants'

const { visibleRows } = useTransactions()

// Alle rijen die nu zichtbaar zijn (tabje + zoekfilter), geselecteerd of niet
const total = computed(() => sumAmounts(visibleRows.value))
const amountIndex = TRANSACTION_COLUMNS.indexOf(AMOUNT_COLUMN)
const restColumns = TRANSACTION_COLUMNS.length - amountIndex - 1
</script>

<template>
    <tfoot>
        <tr class="subtotal">
            <td :colspan="amountIndex">Subtotaal ({{ visibleRows.length }})</td>
            <td class="num nowrap" :class="total < 0 ? 'out' : 'in'">{{ euro(total) }}</td>
            <td :colspan="restColumns"></td>
        </tr>
    </tfoot>
</template>
