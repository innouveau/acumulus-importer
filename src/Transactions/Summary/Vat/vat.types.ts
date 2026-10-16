// Verkoopfactuur uit Acumulus met de bedragen die voor de btw nodig zijn
export interface SalesInvoice {
    entryid: string
    number: string
    date: string
    totalValue: number
    totalValueExclVat: number
}
