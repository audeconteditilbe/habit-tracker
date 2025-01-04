import './assets/main.css'

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