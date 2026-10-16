const escapeXml = (value: string): string =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// { a: { b: 1 } } -> <a><b>1</b></a>; arrays worden herhaalde elementen, lege waarden vallen weg
export const toXml = (value: unknown, tag?: string): string => {
    if (value === undefined || value === null || value === '') return ''
    if (Array.isArray(value)) return value.map((item) => toXml(item, tag)).join('')
    const inner =
        typeof value === 'object'
            ? Object.entries(value as Record<string, unknown>)
                  .map(([key, child]) => toXml(child, key))
                  .join('')
            : escapeXml(String(value))
    return tag ? `<${tag}>${inner}</${tag}>` : inner
}
