import { RESOURCES } from './acumulus.constants'
import type { AcumulusAccount, AcumulusCostCenter, AcumulusCostHeading } from './acumulus.types'
import { asList } from './acumulus.utils'
import { callAcumulus } from './client'

const fetchPicklist = async <T>(resource: string, group: string, item: string): Promise<T[]> => {
    const result = await callAcumulus(resource)
    const container = result.data[group] as Record<string, unknown> | undefined
    return asList<T>(container?.[item])
}

export const fetchCostHeadings = () => fetchPicklist<AcumulusCostHeading>(RESOURCES.costHeadings, 'costheadings', 'costheading')
export const fetchCostCenters = () => fetchPicklist<AcumulusCostCenter>(RESOURCES.costCenters, 'costcenters', 'costcenter')
export const fetchAccounts = () => fetchPicklist<AcumulusAccount>(RESOURCES.accounts, 'accounts', 'account')
