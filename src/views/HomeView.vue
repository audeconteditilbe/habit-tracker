<script setup lang="ts">
import { GqlClientSingleton } from '@/clients'
import ProtectedRoute from '@/components/ProtectedRoute.vue'
import SummaryCard from '@/components/SummaryCard.vue'
import { useUserStore } from '@/stores/userStore'
import type { SummaryHabit } from '@api/types'
import { ref, watch } from 'vue'

const userStore = useUserStore()
const summary = ref<SummaryHabit[]>([])

watch(
  () => userStore.user,
  async () => {
    if (!userStore.user) {
      return
    }
    summary.value = (await GqlClientSingleton.getUserHabitSummary(userStore.user.id))
  }
)
</script>

<template>
  <ProtectedRoute>
    <div class="cards">
      <SummaryCard v-for="item in summary" :key="item.id" :habit="item" />
    </div>
  </ProtectedRoute>
</template>

<style lang="css" scoped>
.cards {
  display: flex;
  flex-direction: column;
  gap: var(--p-gap-m);
}
</style>