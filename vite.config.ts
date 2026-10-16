import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { apiPlugin } from './server/plugin'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), 'ACUMULUS_')
    return {
        plugins: [vue(), apiPlugin(env)],
        server: { port: 5199, host: '127.0.0.1' },
    }
})
