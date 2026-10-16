import { ref, watch } from 'vue'
import type { Rule } from './rule.types'
import { createRule } from './rule.utils'
import { useRules } from './useRules'

// Bewerkbare kopie van de regels; pas bij "Opslaan" terug naar data/rules.json
export const useRuleDraft = () => {
    const { rules, saveRules } = useRules()
    const draft = ref<Rule[]>([])
    const dirty = ref(false)

    const reset = () => {
        draft.value = structuredClone(rules.value.map((rule) => ({ ...rule })))
        dirty.value = false
    }

    watch(rules, reset, { immediate: true })
    watch(draft, () => (dirty.value = true), { deep: true, flush: 'sync' })

    const add = () => draft.value.push(createRule())

    const remove = (index: number) => draft.value.splice(index, 1)

    const move = (index: number, delta: number) => {
        const target = index + delta
        if (target < 0 || target >= draft.value.length) return
        const [rule] = draft.value.splice(index, 1)
        draft.value.splice(target, 0, rule)
    }

    const save = () => saveRules(structuredClone(draft.value.map((rule) => ({ ...rule }))))

    return { draft, dirty, add, remove, move, save }
}
