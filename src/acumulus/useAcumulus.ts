import { ref } from 'vue'
import { fetchConfig } from './config'
import { fetchAccounts, fetchCostCenters, fetchCostHeadings } from './picklists'
import type { AcumulusAccount, AcumulusCostCenter, AcumulusCostHeading } from './acumulus.types'
import { sameName } from '../utils/text'

// Gedeelde state: verbinding met Acumulus en de picklists om namen naar id's te vertalen
const configured = ref(false)
const loadError = ref('')
const costHeadings = ref<AcumulusCostHeading[]>([])
const costCenters = ref<AcumulusCostCenter[]>([])
const accounts = ref<AcumulusAccount[]>([])

const loadConfig = async () => {
    configured.value = (await fetchConfig()).configured
}

const loadPicklists = async () => {
    loadError.value = ''
    try {
        ;[costHeadings.value, costCenters.value, accounts.value] = await Promise.all([fetchCostHeadings(), fetchCostCenters(), fetchAccounts()])
        if (!costHeadings.value.length) {
            loadError.value = 'Kon geen kostensoorten ophalen uit Acumulus. Kloppen de gegevens in .env.local?'
        }
    } catch (error) {
        loadError.value = `Acumulus niet bereikbaar: ${error}`
    }
}

const costHeadingId = (name: string) => costHeadings.value.find((h) => sameName(h.costheadingname, name))?.costheadingid ?? ''

const costCenterId = (name: string) => costCenters.value.find((c) => sameName(c.costcentername, name))?.costcenterid ?? ''

const accountId = (name: string): number | null => {
    const account = accounts.value.find((a) => sameName(a.accountdescription, name) || sameName(a.accountnumber, name))
    return account ? Number(account.accountid) : null
}

// Voor foutmeldingen: welke namen Acumulus wél kent
const accountNames = () => accounts.value.map((a) => [a.accountdescription, a.accountnumber].filter((v) => typeof v === 'string' && v).join(' / '))

const costCenterNames = () => costCenters.value.map((c) => c.costcentername)

export const useAcumulus = () => ({
    configured,
    loadError,
    loadConfig,
    loadPicklists,
    costHeadingId,
    costCenterId,
    accountId,
    accountNames,
    costCenterNames,
})
