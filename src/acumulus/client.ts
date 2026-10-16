import { ResponseStatus } from './acumulus.enum'
import type { AcumulusResult } from './acumulus.types'
import { asList } from './acumulus.utils'

const SUCCESS_STATUSES = [ResponseStatus.Success, ResponseStatus.Warnings]

const MESSAGE_GROUPS = [
    { group: 'errors', item: 'error', label: 'Fout' },
    { group: 'warnings', item: 'warning', label: 'Waarschuwing' },
] as const

const collectMessages = (data: Record<string, unknown>): string[] => {
    return MESSAGE_GROUPS.flatMap(({ group, item, label }) => {
        const container = data[group] as Record<string, unknown> | undefined
        if (!container || typeof container !== 'object') return []
        return asList<Record<string, string>>(container[item]).map((entry) => `${label}: ${entry.message ?? JSON.stringify(entry)}`)
    })
}

export const callAcumulus = async (resource: string, params: Record<string, unknown> = {}, testmode = false): Promise<AcumulusResult> => {
    const response = await fetch(`/api/acumulus/${resource}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params, testmode }),
    })
    const data = (await response.json()) as Record<string, unknown>
    return {
        ok: response.ok && SUCCESS_STATUSES.includes(Number(data.status)),
        data,
        messages: collectMessages(data),
    }
}
