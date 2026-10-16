import { computed, ref } from 'vue'
import { usePeriod } from '../../Upload/Period/usePeriod'
import { useTransactions } from '../../useTransactions'
import { fetchSalesInvoices } from './salesInvoices.api'
import { fetchVatToPay } from './vatReport.api'
import type { SalesInvoice } from './vat.types'
import { inputVat, missingVatCount, salesVat } from './vat.utils'

const { period } = usePeriod()
const { rows } = useTransactions()

const invoices = ref<SalesInvoice[]>([])
// Rubriek 5c uit Acumulus, alleen ter controle
const acumulusVat = ref<number | null>(null)
const loading = ref(false)
const error = ref('')

// Eigen berekening: btw op facturen van het kwartaal min aftrekbare btw op de kosten uit de CSV
const ownSales = computed(() => salesVat(invoices.value))
const ownInput = computed(() => (period.value ? inputVat(rows.value, period.value) : 0))
const ownBalance = computed(() => Math.round((ownSales.value - ownInput.value) * 100) / 100)
const missing = computed(() => (period.value ? missingVatCount(rows.value, period.value) : 0))
const difference = computed(() => (acumulusVat.value === null ? null : Math.round((ownBalance.value - acumulusVat.value) * 100) / 100))

const loadVatReport = async () => {
    if (!period.value) return
    loading.value = true
    error.value = ''
    try {
        const [salesInvoices, report] = await Promise.all([fetchSalesInvoices(period.value), fetchVatToPay(period.value)])
        invoices.value = salesInvoices
        acumulusVat.value = report.vat
        error.value = report.messages.join(' · ')
    } catch (e) {
        error.value = String(e)
    } finally {
        loading.value = false
    }
}

export const useVatReport = () => ({
    period,
    invoices,
    ownSales,
    ownInput,
    ownBalance,
    missing,
    acumulusVat,
    difference,
    loading,
    error,
    loadVatReport,
})
