<script setup lang="ts">
import { GqlClientSingleton } from '@/clients'
import ProtectedRoute from '@/components/ProtectedRoute.vue'
import SummaryCard from '@/components/SummaryCard.vue'
import { useUserStore } from '@/stores/userStore'
import type { SummaryHabit } from '@api/types'
import Button from "primevue/button"
import { ref, watch } from 'vue'

const userStore = useUserStore()
const summary = ref<SummaryHabit[]>([])

const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark-mode')
}

watch(
  () => userStore.user,
  async () => {
    if (!userStore.user) {
      return
    }
    
    summary.value = await GqlClientSingleton.getUserHabitSummary(userStore.user.id)
  }
)

// onMounted(async () => {
//   if (!userStore.user) {
//     return
//   }
  
//   summary.value = await GqlClientSingleton.getUserHabitSummary(userStore.user.id)
// })
</script>

<template>
  <ProtectedRoute>
    <Button label="Toggle Dark Mode" @click="toggleDarkMode()" />
    <div v-for="item in summary" :key="item.id">
      <SummaryCard :habit="item" />
    </div>
  </ProtectedRoute>
</template>
