import type { IncomingMessage, ServerResponse } from 'node:http'

export const readBody = (req: IncomingMessage): Promise<string> =>
    new Promise((resolve, reject) => {
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', () => resolve(body))
        req.on('error', reject)
    })

export const readJson = async <T>(req: IncomingMessage, fallback: T): Promise<T> => {
    const body = await readBody(req)
    return body ? JSON.parse(body) : fallback
}

export const sendJson = (res: ServerResponse, status: number, data: unknown) => {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
}

export const errorBody = (message: string) => ({ status: 1, errors: { error: [{ message }] } })
