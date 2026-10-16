<script setup lang="ts">
import { useSettings } from './Account/useSettings'
import { useTransactions } from '../useTransactions'
import AccountSelect from './Account/AccountSelect.vue'

const { settings } = useSettings()
const { fileName, transactionCount, importFile } = useTransactions()

const onFile = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) importFile(file)
}
</script>

<template>
    <section class="card upload">
        <label class="file">
            <input type="file" accept=".csv,text/csv" @change="onFile" />
            <span>{{ fileName || 'Kies de kwartaal-export van Triodos (CSV)…' }}</span>
        </label>
        <label>
            Rekening
            <AccountSelect v-model="settings.account" />
        </label>
        <span v-if="fileName" class="muted">{{ transactionCount }} transacties ingelezen</span>
    </section>
</template>
