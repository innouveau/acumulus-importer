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

// Stuurt een verzoek naar Acumulus en geeft het JSON-antwoord terug
export const callAcumulus = async (env: AcumulusEnv, resource: string, params: Record<string, unknown>, testmode: boolean) => {
    const response = await fetch(`${apiUrl(env)}/${resource}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ xmlstring: buildRequestXml(env, params, testmode) }).toString(),
    })
    const text = await response.text()
    try {
        return JSON.parse(text)
    } catch {
        return { status: 3, errors: { error: [{ message: `Onverwacht antwoord van Acumulus: ${text.slice(0, 300)}` }] } }
    }
}
