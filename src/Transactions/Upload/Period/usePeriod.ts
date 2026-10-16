import { computed, ref, watch } from 'vue'
import { useTransactions } from '../../useTransactions'
import { QUARTERS_TO_OFFER } from './period.constants'
import { mainQuarterKey, recentQuarterKeys, toPeriod } from './period.utils'

const { rows } = useTransactions()

// Kwartaal waarover we rapporteren; na het inlezen het kwartaal van de CSV
const selectedKey = ref<string | null>(null)

watch(
    () => rows.value.map((row) => row.tx.date),
    (dates) => (selectedKey.value = mainQuarterKey(dates) ?? selectedKey.value),
)

const period = computed(() => (selectedKey.value ? toPeriod(selectedKey.value) : null))

const options = computed(() => {
    const keys = new Set(recentQuarterKeys(QUARTERS_TO_OFFER))
    if (selectedKey.value) keys.add(selectedKey.value)
    return [...keys].sort().reverse().map(toPeriod)
})

export const usePeriod = () => ({ selectedKey, period, options })
