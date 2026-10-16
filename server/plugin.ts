import type { Plugin } from 'vite'
import { apiUrl, callAcumulus, isConfigured, type AcumulusEnv } from './acumulus'
import { errorBody, readJson, sendJson } from './http'
import { isStore, readStore, writeStore } from './store'

// Lokale "backend" in de Vite dev-server:
// - houdt de Acumulus-inloggegevens buiten de browser (ze staan in .env.local)
// - stuurt verzoeken door naar de Acumulus API (geen CORS-gedoe)
// - leest en schrijft de JSON-bestanden in ./data

const STORE_ROUTE = /^\/api\/store\/(\w+)$/
const ACUMULUS_ROUTE = /^\/api\/acumulus\/([\w/]+\.php)$/

export const apiPlugin = (env: AcumulusEnv): Plugin => ({
    name: 'acumulus-local-api',
    configureServer: (server) => {
        server.middlewares.use(async (req, res, next) => {
            const url = req.url ?? ''
            if (!url.startsWith('/api/')) return next()

            try {
                if (url === '/api/config' && req.method === 'GET') {
                    return sendJson(res, 200, { configured: isConfigured(env), apiUrl: apiUrl(env) })
                }

                const store = url.match(STORE_ROUTE)?.[1]
                if (store && isStore(store)) {
                    if (req.method === 'GET') return sendJson(res, 200, readStore(store))
                    if (req.method === 'PUT') {
                        writeStore(store, await readJson(req, null))
                        return sendJson(res, 200, { ok: true })
                    }
                }

                const resource = url.match(ACUMULUS_ROUTE)?.[1]
                if (resource && req.method === 'POST') {
                    if (!isConfigured(env)) {
                        return sendJson(res, 400, errorBody('Geen Acumulus-gegevens: vul .env.local in en herstart.'))
                    }
                    const { params = {}, testmode = true } = await readJson(req, { params: {}, testmode: true })
                    return sendJson(res, 200, await callAcumulus(env, resource, params, testmode))
                }

                sendJson(res, 404, { error: 'Onbekende route' })
            } catch (error) {
                sendJson(res, 500, errorBody(String(error)))
            }
        })
    },
})
