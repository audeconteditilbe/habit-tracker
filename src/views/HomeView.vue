<script setup lang="ts">
import { GqlClientSingleton } from '@/clients';
import ProtectedRoute from '@/components/ProtectedRoute.vue';
import { useUserStore } from '@/stores/user';
import type { Habit } from '@api/types';
import { onMounted, ref } from 'vue';

const habits = ref<Habit[]>([])
const userStore = useUserStore()
const summary = ref([])

onMounted(async () => {
  const user = await userStore.getUser()
  if (!user) {
    return
  }
  
  // RestClientSingleton.getHabits(user.id).then(({results}) => {
  //   habits.value = results
  // })

  GqlClientSingleton.getUserHabitSummary(user.id, 2).then((data) => {
    summary.value = data
  })
})
</script>

<template>
  <ProtectedRoute>
    <div v-for="habit in habits" :key="habit.id">
      - {{ habit.name }}
    </div>
    <br/>
    <br/>
    <div v-for="(item, idx) in summary" :key="idx">
      - {{ item }}
    </div>
  </ProtectedRoute>
</template>
