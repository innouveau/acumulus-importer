// Waarden zoals de Acumulus API ze verwacht
export enum VatRate {
    High = 21,
    Low = 9,
    Zero = 0,
    None = -1,
}

export enum VatType {
    National = 1,
    NationalReverseCharge = 2,
    EuReverseCharge = 3,
    OutsideEu = 4,
}
