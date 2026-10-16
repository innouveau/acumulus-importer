export const normalize = (value: string | undefined): string => {
    return (value ?? '').trim().toLowerCase()
}

export const sameName = (a: string | undefined, b: string | undefined): boolean => {
    return normalize(a) === normalize(b)
}
