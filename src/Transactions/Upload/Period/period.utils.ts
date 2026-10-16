import { MONTHS_PER_QUARTER, QUARTERS_PER_YEAR } from './period.constants'

export interface Period {
    // "2026-Q3"
    key: string
    startdate: string
    enddate: string
    label: string
}

const pad = (value: number) => String(value).padStart(2, '0')

export const quarterKey = (year: number, quarter: number) => `${year}-Q${quarter}`

export const quarterKeyOfDate = (date: string) => {
    const [year, month] = date.split('-').map(Number)
    return quarterKey(year, Math.ceil(month / MONTHS_PER_QUARTER))
}

export const toPeriod = (key: string): Period => {
    const [year, quarter] = key.split('-Q').map(Number)
    const endMonth = quarter * MONTHS_PER_QUARTER
    const lastDay = new Date(year, endMonth, 0).getDate()
    return {
        key,
        startdate: `${year}-${pad(endMonth - MONTHS_PER_QUARTER + 1)}-01`,
        enddate: `${year}-${pad(endMonth)}-${pad(lastDay)}`,
        label: `Q${quarter} ${year}`,
    }
}

// Het kwartaal waar de meeste transacties van de import in vallen
export const mainQuarterKey = (dates: string[]): string | null => {
    const counts = new Map<string, number>()
    for (const date of dates) counts.set(quarterKeyOfDate(date), (counts.get(quarterKeyOfDate(date)) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
}

// De laatste n kwartalen tot en met het huidige, nieuwste eerst
export const recentQuarterKeys = (count: number, today = new Date()): string[] => {
    const current = today.getFullYear() * QUARTERS_PER_YEAR + Math.floor(today.getMonth() / MONTHS_PER_QUARTER)
    return Array.from({ length: count }, (_, i) => {
        const index = current - i
        return quarterKey(Math.floor(index / QUARTERS_PER_YEAR), (index % QUARTERS_PER_YEAR) + 1)
    })
}
