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
        light: {
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
        },
        dark: {
          surface: {
              0: '#ffffff',
              50: '{slate.50}',
              100: '{slate.100}',
              200: '{slate.200}',
              300: '{slate.300}',
              400: '{slate.400}',
              500: '{slate.500}',
              600: '{slate.600}',
              700: '{slate.700}',
              800: '{slate.800}',
              900: '{slate.900}',
              950: '{slate.950}'
          }
        }
      },
      dark: {
          primary: {
              color: '{zinc.50}',
              inverseColor: '{zinc.950}',
              hoverColor: '{zinc.100}',
              activeColor: '{zinc.200}'
          },
          highlight: {
              background: 'rgba(250, 250, 250, .16)',
              focusBackground: 'rgba(250, 250, 250, .24)',
              color: 'rgba(255,255,255,.87)',
              focusColor: 'rgba(255,255,255,.87)'
          }
      }
  }
  }
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