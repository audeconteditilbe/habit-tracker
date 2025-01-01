<script setup lang="ts">
import ClientSingleton from '@/clients';
import ProtectedRoute from '@/components/ProtectedRoute.vue'
import { useUserStore } from '@/stores/user'
import type { Habit } from '@api/types';
import { onMounted, ref } from 'vue'

const habits = ref<Habit[]>([])
const userStore = useUserStore()
const summary = ref([])

// const getQuery = (author: string) => `{\n  habits(author: ${author}) {\n    id\n    name\n    goalTimespan\n    goalType\n    goalFrequency\n    entries {\n      id\n      date\n      description\n    }\n  }\n}`

onMounted(async () => {
  const user = await userStore.getUser()
  if (!user) {
    return
  }
  
  ClientSingleton.getHabits(user.id).then(({results}) => {
    habits.value = results
  })

  // const userHabits = await api.post('/api/summary', { query: getQuery(user.id) })
  // summary.value = userHabits.data.data.habits
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
