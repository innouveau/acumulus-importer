<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBooked } from '../../useBooked'
import { useBooking } from './useBooking'
import { useTransactions } from '../../useTransactions'
import { RowStatus } from './rowStatus.enum'
import type { Row } from '../transaction.types'
import { isApiBooking, isBookable, missingFields } from '../transaction.utils'
import { BookingType } from '../BookingType/bookingType.enum'
import InvoiceDialog from '../Invoice/InvoiceDialog.vue'
import { invoiceLabel } from '../Invoice/invoice.utils'

const props = defineProps<{ row: Row }>()
const { isDone, doneLabel, markDone, unmarkDone } = useBooked()
const { testmode, book } = useBooking()
const { setSelected } = useTransactions()

const missing = computed(() => missingFields(props.row))
const isInvoicePayment = computed(() => props.row.type === BookingType.InvoicePayment)
const matching = ref(false)

const markAsDone = () => {
    markDone(props.row)
    setSelected(props.row, false)
}
</script>

<template>
    <template v-if="isDone(row)">
        <span class="badge ok">✓ {{ doneLabel(row) }}</span>
        <button class="link" @click="unmarkDone(row)">terugzetten</button>
    </template>
    <template v-else>
        <template v-if="isInvoicePayment">
            <div class="nowrap">
                <button v-if="row.invoice" :disabled="row.status === RowStatus.Busy" @click="book(row)">
                    {{ row.status === RowStatus.Busy ? '…' : testmode ? 'Test' : 'Boek' }}
                </button>
                <button :class="{ link: row.invoice }" @click="matching = true">Matchen</button>
            </div>
            <div v-if="row.invoice" class="hint ok-hint">→ {{ invoiceLabel(row.invoice) }}</div>
        </template>
        <template v-else-if="isApiBooking(row)">
            <button :disabled="!isBookable(row) || row.status === RowStatus.Busy" @click="book(row)">
                {{ row.status === RowStatus.Busy ? '…' : testmode ? 'Test' : 'Boek' }}
            </button>
            <div v-if="missing.length" class="hint">Kies eerst: {{ missing.join(', ') }}</div>
        </template>
        <button v-else class="link" @click="markAsDone">markeer als gedaan</button>
    </template>
    <div v-if="row.message && !matching" class="message" :class="row.status">{{ row.message }}</div>
    <InvoiceDialog v-if="matching" :row="row" @close="matching = false" />
</template>
