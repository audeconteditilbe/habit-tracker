<script setup lang="ts">
import api from '@/clients/api';
import ProtectedRoute from '@/components/ProtectedRoute.vue';
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';

const habits = ref<{id: string; name: string}[]>([])
const userStore = useUserStore()
const summary = ref([])

const getQuery = (author: string) => `{\n  habits(author: ${author}) {\n    id\n    name\n    goalTimespan\n    goalType\n    goalFrequency\n    entries {\n      id\n      date\n      description\n    }\n  }\n}`

onMounted(async () => {
  const user = await userStore.getUser()
  if (!user) {
    return
  }
  
  // const nextHabits = await api.get(`/api/habits?userId=${user.id}`)
  // habits.value = nextHabits.data.results

  const userHabits = await api.post('/api/summary', { query: getQuery(user.id) })
  summary.value = userHabits.data.data.habits
})
</script>

<template>
  <ProtectedRoute>
    <div v-for="habit in habits" :key="habit.id">
      - {{ habit.name }}
    </div>
    <br/>
    <br/>
    <div v-for="(item, idx) in summary" :key="idx+10">
      - {{ item }}
    </div>
  </ProtectedRoute>
</template>
