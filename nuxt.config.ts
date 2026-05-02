import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  ssr: false, // Dashboard SPA — no requiere SSR, elimina problemas de hidratación
  build: {
    transpile: ['vuetify'],
  },
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://backendsoftwaresena-production.up.railway.app/api',
    },
  },
  vite: {
    plugins: [
      vuetify({ autoImport: true }),
    ],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  css: ['~/assets/css/sena-theme.css'],
})
