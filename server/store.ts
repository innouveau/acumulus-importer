import fs from 'node:fs'
import path from 'node:path'

// Regels, instellingen en geboekte transacties als JSON in ./data.
// Zolang <naam>.json niet bestaat, wordt <naam>.default.json gelezen.
const DATA_DIR = path.resolve(process.cwd(), 'data')
const STORES = ['rules', 'settings', 'booked']

const storeFile = (name: string) => path.join(DATA_DIR, `${name}.json`)
const defaultFile = (name: string) => path.join(DATA_DIR, `${name}.default.json`)

const readFile = (file: string): unknown => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null)

export const isStore = (name: string) => STORES.includes(name)

export const readStore = (name: string): unknown => {
    const file = storeFile(name)
    return fs.existsSync(file) ? readFile(file) : readFile(defaultFile(name))
}

export const writeStore = (name: string, data: unknown) => {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(storeFile(name), JSON.stringify(data, null, 2))
}
