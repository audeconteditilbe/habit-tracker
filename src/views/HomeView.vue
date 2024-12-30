<script setup lang="ts">
import api from '@/clients/api';
import ProtectedRoute from '@/components/ProtectedRoute.vue';
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';

const habits = ref<{id: string; name: string}[]>([])
const userStore = useUserStore()

onMounted(async () => {
  const user = await userStore.getUser()
  if (!user) {
    return
  }
  
  const nextHabits = await api.get(`/api/habits?userId=${user.id}`)
  habits.value = nextHabits.data.results

})
</script>

<template>
  <ProtectedRoute>
    <div v-for="habit in habits" :key="habit.id">
      - {{ habit.name }}
    </div>
  </ProtectedRoute>
</template>
