import { computed, ref } from 'vue'
import { Category } from './CategoryTabs/category.enum'
import type { Row } from './Transaction/transaction.types'
import { parseTriodosCsv } from './Upload/parseTriodosCsv'
import { createRow, isBookable } from './Transaction/transaction.utils'
import { findMatchingRule } from '../Rules/rule.utils'
import { matchesSearch } from './TableActions/Search/search.utils'
import { useBooked } from './useBooked'
import { useRules } from '../Rules/useRules'

const { rules, loadRules } = useRules()
const { isDone } = useBooked()

const fileName = ref('')
const transactionCount = ref(0)
const rows = ref<Row[]>([])
const selected = ref<Set<string>>(new Set())
const category = ref<Category>(Category.Normal)
const hideDone = ref(false)
const search = ref('')

const importFile = async (file: File) => {
    fileName.value = file.name
    const transactions = parseTriodosCsv(await file.text())
    transactionCount.value = transactions.length
    // Regels opnieuw ophalen, zodat aanpassingen in data/ meteen meetellen
    await loadRules()
    rows.value = transactions.map((tx) => createRow(tx, findMatchingRule(rules.value, tx)))
    selected.value = new Set(rows.value.filter((row) => isBookable(row) && !isDone(row)).map((row) => row.tx.key))
}

const visibleRows = computed(() =>
    rows.value.filter((row) => row.category === category.value && !(hideDone.value && isDone(row)) && matchesSearch(row, search.value)),
)

const selectedBookable = computed(() => visibleRows.value.filter((row) => selected.value.has(row.tx.key) && isBookable(row) && !isDone(row)))

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
    transactionCount,
    rows,
    category,
    hideDone,
    search,
    importFile,
    visibleRows,
    selectedBookable,
    openCount,
    isSelected,
    setSelected,
})
