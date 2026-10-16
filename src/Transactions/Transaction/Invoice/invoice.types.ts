// Openstaande verkoopfactuur uit het Acumulus-rapport "openstaande debiteuren"
export interface UnpaidInvoice {
    entryid: string
    token: string
    number: string
    issuedate: string
    contactname: string
    invoicenote: string
    amount: number
}
