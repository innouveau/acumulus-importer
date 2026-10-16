import { ref } from 'vue'
import { loadStore, saveStore } from '../storage/store'
import type { Rule } from './rule.types'

const rules = ref<Rule[]>([])

const loadRules = async () => {
    rules.value = (await loadStore<Rule[]>('rules')) ?? []
}

const saveRules = async (updated: Rule[]) => {
    rules.value = updated
    await saveStore('rules', updated)
}

const findRule = (id: string | null) => rules.value.find((rule) => rule.id === id)

export const useRules = () => ({ rules, loadRules, saveRules, findRule })
