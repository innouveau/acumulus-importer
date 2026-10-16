// Status in elk Acumulus-antwoord
export enum ResponseStatus {
    Success = 0,
    Errors = 1,
    Warnings = 2,
    Exception = 3,
}

export enum SupplierType {
    Debtor = 1,
    Creditor = 2,
}

export enum PaymentStatus {
    Due = 1,
    Paid = 2,
}

// Richting van een privé-boeking, gezien vanaf de zakelijke rekening
export enum Polarity {
    Deduct = 'C',
    Add = 'D',
}
