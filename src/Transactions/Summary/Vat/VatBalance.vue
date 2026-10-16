<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useAcumulus } from '../../../acumulus/useAcumulus'
import { euro } from '../../Transaction/Amount/amount.utils'
import { useVatReport } from './useVatReport'
import { ROUNDING_TOLERANCE } from './vat.constants'

const { configured } = useAcumulus()
const { period, invoices, ownSales, ownInput, ownBalance, missing, acumulusVat, difference, loading, error, loadVatReport } =
    useVatReport()

const load = () => configured.value && loadVatReport()
onMounted(load)
watch(() => period.value?.key, load)
const matches = computed(() => difference.value !== null && Math.abs(difference.value) <= ROUNDING_TOLERANCE)
</script>

<template>
    <div class="stat">
        <span class="muted">Btw-saldo {{ period?.label }}</span>
        <strong>{{ loading ? '…' : euro(ownBalance) }}</strong>
        <span class="stat-hint">
            btw {{ invoices.length }} facturen {{ euro(ownSales) }} − btw kosten {{ euro(ownInput) }}
        </span>
        <span v-if="!loading && acumulusVat !== null" class="stat-hint" :class="matches ? 'ok-hint' : 'hint'">
            Acumulus: {{ euro(acumulusVat) }} {{ matches ? '✓' : `· verschil ${euro(difference ?? 0)}` }}
        </span>
        <span v-if="missing" class="hint">{{ missing }} kostenpost(en) zonder btw-tarief tellen nog niet mee</span>
        <span class="stat-hint">
            <button class="link" :disabled="loading || !configured" @click="loadVatReport">vernieuwen</button>
        </span>
        <span v-if="error" class="message error">{{ error }}</span>
    </div>
</template>
