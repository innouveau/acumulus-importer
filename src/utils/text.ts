// Acumulus geeft velden soms als getal, of als {} wanneer ze leeg zijn
export const normalize = (value: unknown): string => {
    return typeof value === 'string' || typeof value === 'number' ? String(value).trim().toLowerCase() : ''
}

export const sameName = (a: unknown, b: unknown): boolean => {
    const left = normalize(a)
    return left !== '' && left === normalize(b)
}
