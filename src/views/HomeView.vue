<script setup lang="ts">
import { GqlClientSingleton } from '@/clients'
import ProtectedRoute from '@/components/ProtectedRoute.vue'
import SummaryCard from '@/components/SummaryCard.vue'
import { useUserStore } from '@/stores/user'
import type { SummaryHabit } from '@api/types'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const summary = ref<SummaryHabit[]>([])

onMounted(async () => {
  const user = await userStore.getUser()
  if (!user) {
    return
  }
  
  summary.value = await GqlClientSingleton.getUserHabitSummary(user.id)
})
</script>

<template>
  <ProtectedRoute>
    <div v-for="item in summary" :key="item.id">
      <SummaryCard :habit="item" />
    </div>
  </ProtectedRoute>
</template>
