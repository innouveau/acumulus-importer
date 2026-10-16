import { ref, watch } from 'vue'
import { loadStore, saveStore } from '../../../storage/store'
import { Account } from './account.enum'
import type { Settings } from './account.types'
import { enumValues } from '../../../utils/enum'

const settings = ref<Settings>({ account: Account.InnouveauTriodos })

const loadSettings = async () => {
    const stored = await loadStore<Partial<Settings>>('settings')
    const account = enumValues(Account).find((value) => value === stored?.account)
    settings.value = { account: account ?? Account.InnouveauTriodos }
}

watch(settings, (value) => saveStore('settings', value), { deep: true })

export const useSettings = () => ({ settings, loadSettings })
