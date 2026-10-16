import { RESOURCES } from '../../../acumulus/acumulus.constants'
import { asList } from '../../../acumulus/acumulus.utils'
import { callAcumulus } from '../../../acumulus/client'
import type { Period } from '../../Upload/Period/period.utils'
import { HOME_COUNTRY, VAT_TO_PAY_SECTION } from './vat.constants'

type CountryReport = Record<string, unknown> & { countrycode?: string }

// Te betalen btw volgens het btw-rapport van Acumulus (wat er geboekt is, op factuurdatum)
export const fetchVatToPay = async (period: Period): Promise<{ vat: number | null; messages: string[] }> => {
    const result = await callAcumulus(RESOURCES.taxReport, { startdate: period.startdate, enddate: period.enddate })
    const country = asList<CountryReport>(result.data.country).find((c) => c.countrycode === HOME_COUNTRY)
    const section = country?.[VAT_TO_PAY_SECTION] as { vat?: unknown } | undefined
    const vat = section?.vat !== undefined ? Number(section.vat) : null
    return { vat: Number.isNaN(vat) ? null : vat, messages: result.messages }
}
