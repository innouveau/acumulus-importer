import { VatRate, VatType } from './vat.enum'

export const VAT_RATE_LABELS: Record<VatRate, string> = {
    [VatRate.High]: '21%',
    [VatRate.Low]: '9%',
    [VatRate.Zero]: '0%',
    [VatRate.None]: 'Geen btw',
}

export const VAT_TYPE_LABELS: Record<VatType, string> = {
    [VatType.National]: 'Nationaal',
    [VatType.NationalReverseCharge]: 'NL verlegd',
    [VatType.EuReverseCharge]: 'EU verlegd',
    [VatType.OutsideEu]: 'Buiten EU',
}

// Standaard voor een losse inkomende factuur
export const DEFAULT_VAT_RATE = VatRate.High
export const DEFAULT_VAT_TYPE = VatType.National
