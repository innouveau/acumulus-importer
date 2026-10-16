<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useBooking } from '../Actions/useBooking'
import { useTransactions } from '../../useTransactions'
import Amount from '../Amount/Amount.vue'
import type { Row } from '../transaction.types'
import { normalize } from '../../../utils/text'
import InvoiceList from './InvoiceList.vue'
import type { UnpaidInvoice } from './invoice.types'
import { sortBySuggestion } from './invoice.utils'
import { useInvoices } from './useInvoices'

const props = defineProps<{ row: Row }>()
const emit = defineEmits<{ close: [] }>()

const { invoices, loading, error, loadInvoices } = useInvoices()
const { linkedTokens } = useTransactions()
const { testmode, book } = useBooking()

const choice = ref<UnpaidInvoice | null>(props.row.invoice)
const filter = ref('')
const busy = ref(false)

// Facturen die al aan een andere betaling hangen vallen weg; beste suggesties bovenaan
const candidates = computed(() => {
    const taken = linkedTokens(props.row)
    const term = normalize(filter.value)
    const open = invoices.value.filter((invoice) => !taken.has(invoice.token))
    const filtered = term ? open.filter((invoice) => normalize(`${invoice.number} ${invoice.contactname}`).includes(term)) : open
    return sortBySuggestion(filtered, props.row.tx)
})

const confirm = async () => {
    props.row.invoice = choice.value
    busy.value = true
    const ok = await book(props.row)
    busy.value = false
    if (ok && !testmode.value) emit('close')
}

const unlink = () => {
    props.row.invoice = null
    choice.value = null
}

const onKey = (event: KeyboardEvent) => event.key === 'Escape' && emit('close')
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
    <div class="overlay" @click.self="emit('close')">
        <div class="dialog" role="dialog" aria-label="Factuur matchen">
            <header class="dialog-header">
                <h2>Factuur matchen</h2>
                <button class="link" @click="emit('close')">✕</button>
            </header>

            <div class="dialog-tx">
                <span>{{ row.tx.date }}</span>
                <strong>{{ row.tx.counterparty }}</strong>
                <span class="muted">{{ row.tx.description }}</span>
                <Amount :tx="row.tx" />
            </div>

            <div class="dialog-tools">
                <input v-model="filter" type="search" class="search" placeholder="Zoek op factuurnummer of klant…" />
                <button class="link" :disabled="loading" @click="loadInvoices">{{ loading ? 'Laden…' : 'Vernieuwen' }}</button>
            </div>
            <div v-if="error" class="message error">{{ error }}</div>

            <InvoiceList v-model="choice" :invoices="candidates" :tx="row.tx" />

            <div v-if="row.message" class="message" :class="row.status">{{ row.message }}</div>

            <footer class="dialog-footer">
                <button v-if="row.invoice" class="link danger" @click="unlink">Ontkoppelen</button>
                <button @click="emit('close')">Annuleren</button>
                <button class="primary" :disabled="!choice || busy" @click="confirm">
                    {{ busy ? '…' : testmode ? 'Test' : 'Op betaald zetten' }}
                </button>
            </footer>
        </div>
    </div>
</template>
