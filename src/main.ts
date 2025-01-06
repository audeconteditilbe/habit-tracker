import './assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import Nora from '@primevue/themes/nora'
import App from './App.vue'
import router from './router'
import { definePreset } from '@primevue/themes'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const Preset = definePreset(Nora, {
  semantic: {
    primary: {
      50: '{emerald.50}',
      100: '{emerald.100}',
      200: '{emerald.200}',
      300: '{emerald.300}',
      400: '{emerald.400}',
      500: '{emerald.500}',
      600: '{emerald.600}',
      700: '{emerald.700}',
      800: '{emerald.800}',
      900: '{emerald.900}',
      950: '{emerald.950}'
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{stone.50}',
          100: '{stone.100}',
          200: '{stone.200}',
          300: '{stone.300}',
          400: '{stone.400}',
          500: '{stone.500}',
          600: '{stone.600}',
          700: '{stone.700}',
          800: '{stone.800}',
          900: '{stone.900}',
          950: '{stone.950}'
        }
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '{zinc.50}',
          100: '{zinc.100}',
          200: '{zinc.200}',
          300: '{zinc.300}',
          400: '{zinc.400}',
          500: '{zinc.500}',
          600: '{zinc.600}',
          700: '{zinc.700}',
          800: '{zinc.800}',
          900: '{zinc.900}',
          950: '{zinc.950}'
        }
      }
    },

    // CUSTOM DEFINED
    margin: {
      xs: '0.3rem',
      s: '0.5rem',
      m: '0.75rem',
      l: '1rem',
      xl: '2rem',
    },
    padding: {
      xs: '0.3rem',
      s: '0.5rem',
      m: '0.75rem',
      l: '1rem',
      xl: '2rem',
    },
    gap: {
      xs: '0.1rem',
      s: '0.5rem',
      m: '0.75rem',
      l: '1rem',
      xl: '2rem',
    }
  },
  // components: {
  //   card: {
  //     colorScheme: {
  //       light: {
  //         background: '{surface.100}'
  //       },
  //       dark: {
  //         background: '{surface.900}'
  //       }
  //     }
  //   }
  // }
})

app.use(PrimeVue, {
  theme: {
    preset: Preset,
    options: {
      darkModeSelector: '.dark-mode',

    }
  }
})

app.mount('#app')