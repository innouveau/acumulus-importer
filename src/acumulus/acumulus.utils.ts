// Acumulus geeft één item als object en meerdere als array
export const asList = <T>(value: unknown): T[] => {
    if (!value) return []
    return (Array.isArray(value) ? value : [value]) as T[]
}
