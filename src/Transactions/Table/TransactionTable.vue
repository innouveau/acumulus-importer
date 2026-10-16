<script setup lang="ts">
import { AMOUNT_COLUMN, TRANSACTION_COLUMNS } from './table.constants'
import { useTransactions } from '../useTransactions'
import Transaction from '../Transaction/Transaction.vue'

const { visibleRows } = useTransactions()
</script>

<template>
    <div class="table-scroll">
        <table>
            <thead>
                <tr>
                    <th v-for="(column, index) in TRANSACTION_COLUMNS" :key="index" :class="{ num: column === AMOUNT_COLUMN }">{{ column }}</th>
                </tr>
            </thead>
            <tbody>
                <Transaction v-for="row in visibleRows" :key="row.tx.key" :row="row" />
            </tbody>
        </table>
    </div>
</template>
