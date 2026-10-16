import { RESOURCES } from '../acumulus/acumulus.constants'
import { callAcumulus } from '../acumulus/client'
import type { BookedVat } from './booked.types'
import { VatRate, VatType } from './Transaction/Vat/vat.enum'

type Raw = Record<string, unknown>

const flag = (value: unknown) => String(value) === '1'

// Btw-tarief afleiden uit bedrag met en zonder btw, afgerond op het dichtstbijzijnde bekende tarief
const RATES = [VatRate.High, VatRate.Low, VatRate.Zero]
const deriveRate = (total: number, exclVat: number): VatRate => {
    if (!exclVat || total === exclVat) return VatRate.None
    const percentage = ((total - exclVat) / exclVat) * 100
    return RATES.reduce((best, rate) => (Math.abs(rate - percentage) < Math.abs(best - percentage) ? rate : best))
}

const deriveType = (entry: Raw): VatType => {
    if (flag(entry.vatreversecharge)) return flag(entry.foreigneu) ? VatType.EuReverseCharge : VatType.NationalReverseCharge
    if (flag(entry.foreignnoneu)) return VatType.OutsideEu
    return VatType.National
}

// Hoe een boeking echt in Acumulus staat
export const fetchBookedVat = async (entryid: string): Promise<BookedVat | null> => {
    const result = await callAcumulus(RESOURCES.entryInfo, { entryid })
    const entry = result.data.entry as Raw | undefined
    if (!result.ok || !entry) return null
    const vattype = deriveType(entry)
    // Bij verlegde btw staat het bedrag zonder btw; het tarief doet voor de berekening dan niet ter zake
    const vatrate = vattype === VatType.National ? deriveRate(Number(entry.totalvalue), Number(entry.totalvalueexclvat)) : VatRate.High
    return { vatrate, vattype }
}
