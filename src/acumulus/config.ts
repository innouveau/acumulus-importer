export interface ServerConfig {
    configured: boolean
    apiUrl: string
}

export const fetchConfig = async (): Promise<ServerConfig> => {
    return (await fetch('/api/config')).json()
}
