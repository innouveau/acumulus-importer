import { toXml } from './xml'

const DEFAULT_API_URL = 'https://api.sielsystems.nl/acumulus/stable'
const APPLICATION = 'acumulus-importer'

export interface AcumulusEnv {
    ACUMULUS_CODE?: string
    ACUMULUS_USERNAME?: string
    ACUMULUS_PASSWORD?: string
    ACUMULUS_EMAIL_ON_ERROR?: string
    ACUMULUS_API_URL?: string
}

export const apiUrl = (env: AcumulusEnv) => (env.ACUMULUS_API_URL || DEFAULT_API_URL).replace(/\/$/, '')

export const isConfigured = (env: AcumulusEnv) => Boolean(env.ACUMULUS_CODE && env.ACUMULUS_USERNAME && env.ACUMULUS_PASSWORD)

const buildRequestXml = (env: AcumulusEnv, params: Record<string, unknown>, testmode: boolean) =>
    '<?xml version="1.0" encoding="UTF-8"?><myxml>' +
    toXml({
        contract: {
            contractcode: env.ACUMULUS_CODE,
            username: env.ACUMULUS_USERNAME,
            password: env.ACUMULUS_PASSWORD,
            emailonerror: env.ACUMULUS_EMAIL_ON_ERROR,
            emailonwarning: env.ACUMULUS_EMAIL_ON_ERROR,
        },
        format: 'json',
        testmode: testmode ? 1 : 0,
        lang: 'nl',
        connector: { application: APPLICATION, development: 'lokaal' },
        ...params,
    }) +
    '</myxml>'

const TOO_MANY_REQUESTS = 429
const MAX_RETRIES = 4
const RETRY_DELAY_MS = 1000

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Bij 429 (te veel verzoeken) wachten en opnieuw proberen, steeds wat langer
const post = async (url: string, body: string, attempt = 0): Promise<Response> => {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    if (response.status !== TOO_MANY_REQUESTS || attempt >= MAX_RETRIES) return response
    await wait(RETRY_DELAY_MS * 2 ** attempt)
    return post(url, body, attempt + 1)
}

// Stuurt een verzoek naar Acumulus en geeft het JSON-antwoord terug
export const callAcumulus = async (env: AcumulusEnv, resource: string, params: Record<string, unknown>, testmode: boolean) => {
    const body = new URLSearchParams({ xmlstring: buildRequestXml(env, params, testmode) }).toString()
    const response = await post(`${apiUrl(env)}/${resource}`, body)
    const text = await response.text()
    try {
        return JSON.parse(text)
    } catch {
        const reason = response.status === TOO_MANY_REQUESTS ? 'Acumulus geeft aan dat er te veel verzoeken zijn, probeer het zo opnieuw.' : text.slice(0, 300)
        return { status: 3, errors: { error: [{ message: `Onverwacht antwoord van Acumulus: ${reason}` }] } }
    }
}
