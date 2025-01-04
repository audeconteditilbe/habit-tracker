<script setup lang="ts">
import type { SummaryHabit } from '@api/types';

const {
  habit
} = defineProps<{ habit: SummaryHabit }>()

const {
  entries,
  goal,
  goalTimespan,
  goalType,
  name,
} = habit

</script>

<template>
  <div class="">
    <h3>{{ name }}</h3>
    
    <div>
      <span>{{ goal }}</span>
      <span>{{ goalType }}</span>
      <span>{{ goalTimespan }}</span>
    </div>
    
    <div v-for="entry in entries" :key="entry.id">
      {{ new Date(entry.date) }}
    </div>
  </div>
</template>

<style scoped>
</style>
