<script setup lang="ts">
import { GqlClientSingleton } from '@/clients'
import ProtectedRoute from '@/components/ProtectedRoute.vue'
import SummaryCard from '@/components/SummaryCard.vue'
import { useUserStore } from '@/stores/userStore'
import type { SummaryHabit } from '@api/types'
import ProgressSpinner from 'primevue/progressspinner'
import { onMounted, ref, watch } from 'vue'

const userStore = useUserStore()
const summary = ref<SummaryHabit[]>([])

const loading = ref<boolean>(false)

const fetchSummary = async () => {
  if (!userStore.user) {
    return
  }
  loading.value = true
  try {
    summary.value = await GqlClientSingleton.getUserHabitSummary(userStore.user.id)
  } catch {}
  loading.value = false
}
watch(() => userStore.user, fetchSummary)
onMounted(fetchSummary)
</script>

<template>
  <ProtectedRoute>
    <ProgressSpinner v-if="loading" class="summary-loading-view"/>
    <div v-else class="summary-view-cards">
      <SummaryCard v-for="item in summary" :key="item.id" :habit="item" />
    </div>
  </ProtectedRoute>
</template>

<style lang="css" scoped>
.summary-loading-view {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.summary-view-cards {
  display: flex;
  flex-direction: column;
  gap: var(--p-gap-m);
}
</style>