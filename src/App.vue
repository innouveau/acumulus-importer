<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppHeader from './Header/AppHeader.vue'
import AppNotices from './Notices/AppNotices.vue'
import Rules from './Rules/Rules.vue'
import Transactions from './Transactions/Transactions.vue'
import { useAcumulus } from './acumulus/useAcumulus'
import { useBooked } from './Transactions/useBooked'
import { useRules } from './Rules/useRules'
import { useSettings } from './Transactions/Upload/Account/useSettings'
import { View } from './view.enum'

const view = ref<View>(View.Transactions)

const { configured, loadConfig, loadPicklists } = useAcumulus()
const { loadRules } = useRules()
const { loadSettings } = useSettings()
const { loadBooked } = useBooked()

onMounted(async () => {
    await Promise.all([loadConfig(), loadRules(), loadSettings(), loadBooked()])
    if (configured.value) await loadPicklists()
})
</script>

<template>
    <AppHeader v-model="view" />
    <AppNotices />
    <main>
        <Transactions v-if="view === View.Transactions" />
        <Rules v-else />
    </main>
</template>
