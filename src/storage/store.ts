// Lokale JSON-opslag in ./data, via de dev-server
export type StoreName = 'rules' | 'settings' | 'booked'

export const loadStore = async <T>(name: StoreName): Promise<T | null> => {
    return (await fetch(`/api/store/${name}`)).json()
}

export const saveStore = async (name: StoreName, data: unknown): Promise<void> => {
    await fetch(`/api/store/${name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
}
