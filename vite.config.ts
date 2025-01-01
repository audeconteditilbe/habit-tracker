import { fileURLToPath, URL } from 'node:url'

import { CommonServerOptions, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const vitePreviewPort = process.env.HTTP_PORT
  ? Number.parseInt(process.env.HTTP_PORT)
  : 5173
export const base = './'

const proxy: CommonServerOptions['proxy'] = {
  '/api': { target: 'http://localhost:8000' },
}

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@types': fileURLToPath(new URL('./apis/types', import.meta.url)),
    },
  },
  preview: { cors: false, host: true, port: vitePreviewPort, proxy },
  server: { cors: true, host: true, port: vitePreviewPort, proxy },
})
