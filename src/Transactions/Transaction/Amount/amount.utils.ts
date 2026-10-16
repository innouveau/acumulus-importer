export const euro = (value: number): string => {
    return value.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })
}
