import { ref } from 'vue'
import type { UnpaidInvoice } from './invoice.types'
import { fetchUnpaidInvoices } from './invoices.api'

// Openstaande verkoopfacturen uit Acumulus, om betalingen aan te koppelen
const invoices = ref<UnpaidInvoice[]>([])
const loading = ref(false)
const error = ref('')

const loadInvoices = async () => {
    loading.value = true
    error.value = ''
    try {
        const result = await fetchUnpaidInvoices()
        invoices.value = result.invoices
        error.value = result.messages.join(' · ')
    } catch (e) {
        error.value = String(e)
    } finally {
        loading.value = false
    }
}

export const useInvoices = () => ({ invoices, loading, error, loadInvoices })
