<script setup lang="ts">
import { computed } from 'vue'
import { euro } from '../../Transaction/Amount/amount.utils'
import { useTransactions } from '../../useTransactions'
import { AMOUNT_COLUMN, TRANSACTION_COLUMNS } from '../table.constants'
import { subtotal } from './subtotal.utils'

const { selectedBookable } = useTransactions()

const total = computed(() => subtotal(selectedBookable.value))
const amountIndex = TRANSACTION_COLUMNS.indexOf(AMOUNT_COLUMN)
const restColumns = TRANSACTION_COLUMNS.length - amountIndex - 1
</script>

<template>
    <tfoot>
        <tr class="subtotal">
            <td :colspan="amountIndex">Subtotaal selectie ({{ selectedBookable.length }})</td>
            <td class="num nowrap" :class="total < 0 ? 'out' : 'in'">{{ euro(total) }}</td>
            <td :colspan="restColumns"></td>
        </tr>
    </tfoot>
</template>
