// Waarden van een numeriek of string-enum (numerieke enums hebben ook omgekeerde keys)
export const enumValues = <T extends Record<string, string | number>>(enumObject: T): T[keyof T][] => {
    const values = Object.values(enumObject) as T[keyof T][]
    const numbers = values.filter((value) => typeof value === 'number')
    return numbers.length ? numbers : values
}
