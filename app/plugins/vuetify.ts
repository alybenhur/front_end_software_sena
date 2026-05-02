import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { es } from 'vuetify/locale'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    locale: {
      locale: 'es',
      messages: { es },
    },
    theme: {
      defaultTheme: 'sena',
      themes: {
        sena: {
          dark: true,
          colors: {
            // Fondos
            background: '#06160d',
            surface: '#0f2418',
            'surface-bright': '#143020',
            'surface-light': '#1a3a26',
            'surface-variant': '#0a2014',

            // Marca SENA
            primary: '#4cdf80',
            'primary-darken-1': '#2E8B57',
            secondary: '#26A69A',
            'secondary-darken-1': '#00695C',
            accent: '#80CBC4',

            // Estados
            error: '#FF5252',
            info: '#4FC3F7',
            success: '#4CAF50',
            warning: '#FFA726',

            // Texto sobre superficies
            'on-background': '#e8f5e9',
            'on-surface': '#e8f5e9',
            'on-surface-variant': '#c8e6c9',
            'on-primary': '#061410',
            'on-secondary': '#061410',
            'on-error': '#ffffff',
            'on-success': '#061410',
            'on-warning': '#061410',
            'on-info': '#061410',
          },
          variables: {
            'border-color': '#4cdf80',
            'border-opacity': 0.18,
            'high-emphasis-opacity': 0.95,
            'medium-emphasis-opacity': 0.7,
            'disabled-opacity': 0.4,
            'idle-opacity': 0.04,
            'hover-opacity': 0.08,
            'focus-opacity': 0.12,
            'selected-opacity': 0.14,
            'activated-opacity': 0.16,
            'pressed-opacity': 0.18,
            'dragged-opacity': 0.10,
          },
        },
      },
    },
  })
  app.vueApp.use(vuetify)
})
