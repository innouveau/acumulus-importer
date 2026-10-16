<script setup lang="ts">
import { computed } from 'vue'
import { useAcumulus } from '../../../acumulus/useAcumulus'
import { euro } from '../../Transaction/Amount/amount.utils'
import { useVatReport } from './useVatReport'
import { ROUNDING_TOLERANCE } from './vat.constants'

const { configured } = useAcumulus()
const { acumulusVat, difference, loading, error, loadVatReport } = useVatReport()

const matches = computed(() => difference.value !== null && Math.abs(difference.value) <= ROUNDING_TOLERANCE)
</script>

<template>
    <div class="stat">
        <span class="muted">
            Btw volgens Acumulus
            <button class="link" title="Opnieuw ophalen" :disabled="loading || !configured" @click="loadVatReport">↻</button>
        </span>
        <strong v-if="loading">…</strong>
        <strong v-else-if="acumulusVat === null">—</strong>
        <strong v-else :class="matches ? 'in' : 'out'">
            {{ euro(acumulusVat) }} {{ matches ? '✓' : `(verschil ${euro(difference ?? 0)})` }}
        </strong>
        <span v-if="error" class="message error">{{ error }}</span>
    </div>
</template>
