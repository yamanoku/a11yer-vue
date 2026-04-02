import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  app: {
    baseURL: '/a11yer-vue/',
    head: {
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
  css: ['~/assets/main.css'],
  alias: {
    'a11yer-vue': fileURLToPath(new URL('../dist/index.js', import.meta.url)),
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['vue'],
    },
  },
})
