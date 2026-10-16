<script setup lang="ts">
import { useTransactions } from './useTransactions'
import CategoryTabs from './CategoryTabs/CategoryTabs.vue'
import TableActions from './TableActions/TableActions.vue'
import TransactionTable from './Table/TransactionTable.vue'
import Summary from './Summary/Summary.vue'
import Upload from './Upload/Upload.vue'

const { rows } = useTransactions()
</script>

<template>
    <Upload />
    <section v-if="rows.length" class="card">
        <CategoryTabs />
        <TableActions />
        <TransactionTable />
    </section>
    <Summary v-if="rows.length" />
</template>
