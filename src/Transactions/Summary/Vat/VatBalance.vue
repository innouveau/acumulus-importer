<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useAcumulus } from '../../../acumulus/useAcumulus'
import { euro } from '../../Transaction/Amount/amount.utils'
import { useVatReport } from './useVatReport'

const { configured } = useAcumulus()
const { period, invoices, ownSales, ownInput, ownBalance, missing, loading, loadVatReport } = useVatReport()

const load = () => configured.value && loadVatReport()
onMounted(load)
watch(() => period.value?.key, load)
</script>

<template>
    <div class="stat" :title="`btw ${invoices.length} facturen ${euro(ownSales)} − btw kosten ${euro(ownInput)}`">
        <span class="muted">Btw-saldo {{ period?.label }}</span>
        <strong>{{ loading ? '…' : euro(ownBalance) }}</strong>
        <span v-if="missing" class="hint">{{ missing }} kostenpost(en) zonder btw-tarief tellen niet mee</span>
    </div>
</template>
