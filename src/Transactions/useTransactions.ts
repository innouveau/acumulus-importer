import { computed, ref } from 'vue'
import { Category } from './CategoryTabs/category.enum'
import type { Row } from './Transaction/transaction.types'
import { parseTriodosCsv } from './Upload/parseTriodosCsv'
import { createRow, isBookable } from './Transaction/transaction.utils'
import { findMatchingRule } from '../Rules/rule.utils'
import { matchesSearch } from './TableActions/Search/search.utils'
import { restoreBookedVat } from './booked.utils'
import { useBooked } from './useBooked'
import { useRules } from '../Rules/useRules'
import { isStrongMatch } from './Transaction/Invoice/invoice.utils'
import { useInvoices } from './Transaction/Invoice/useInvoices'
import { BookingType } from './Transaction/BookingType/bookingType.enum'

const { rules, loadRules } = useRules()
const { booked, isDone } = useBooked()
const { invoices } = useInvoices()

const fileName = ref('')
const linebreak = ref('\n')
const transactionCount = ref(0)
const rows = ref<Row[]>([])
const selected = ref<Set<string>>(new Set())
const category = ref<Category>(Category.Normal)
const hideDone = ref(false)
const search = ref('')

const importFile = async (file: File) => {
    fileName.value = file.name
    const { transactions, linebreak: fileLinebreak } = parseTriodosCsv(await file.text())
    linebreak.value = fileLinebreak
    transactionCount.value = transactions.length
    // Regels opnieuw ophalen, zodat aanpassingen in data/ meteen meetellen
    await loadRules()
    rows.value = transactions.map((tx) => createRow(tx, findMatchingRule(rules.value, tx)))
    restoreBooked()
    linkInvoices()
    selected.value = new Set(rows.value.filter((row) => isBookable(row) && !isDone(row)).map((row) => row.tx.key))
}

// Geboekte rijen krijgen hun btw-instellingen terug, zodat de btw-berekening klopt
const restoreBooked = () => rows.value.forEach((row) => restoreBookedVat(row, booked.value[row.tx.key]))

// Factuur die al aan een andere rij hangt, kan niet nog eens gekoppeld worden
const linkedTokens = (except?: Row) =>
    new Set(rows.value.filter((row) => row !== except && row.invoice).map((row) => row.invoice!.token))

// Koppelt betalingen automatisch als factuurnummer én bedrag precies kloppen
const linkInvoices = () => {
    for (const row of rows.value) {
        if (row.type !== BookingType.InvoicePayment || row.invoice || isDone(row)) continue
        const taken = linkedTokens()
        const matches = invoices.value.filter((invoice) => !taken.has(invoice.token) && isStrongMatch(invoice, row.tx))
        if (matches.length === 1) {
            row.invoice = matches[0]
            setSelected(row, true)
        }
    }
}

const visibleRows = computed(() =>
    rows.value.filter((row) => row.category === category.value && !(hideDone.value && isDone(row)) && matchesSearch(row, search.value)),
)

const selectedBookable = computed(() => visibleRows.value.filter((row) => selected.value.has(row.tx.key) && isBookable(row) && !isDone(row)))

// Alles wat nog niet geboekt of afgehandeld is, over alle tabjes heen
const remainingRows = computed(() => rows.value.filter((row) => !isDone(row)))

const openCount = (cat: Category) => rows.value.filter((row) => row.category === cat && !isDone(row)).length

const isSelected = (row: Row) => selected.value.has(row.tx.key)

const setSelected = (row: Row, value: boolean) => {
    const next = new Set(selected.value)
    if (value) next.add(row.tx.key)
    else next.delete(row.tx.key)
    selected.value = next
}

export const useTransactions = () => ({
    fileName,
    linebreak,
    remainingRows,
    transactionCount,
    rows,
    category,
    hideDone,
    search,
    importFile,
    linkInvoices,
    restoreBooked,
    linkedTokens,
    visibleRows,
    selectedBookable,
    openCount,
    isSelected,
    setSelected,
})
