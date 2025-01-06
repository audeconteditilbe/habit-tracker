<script setup lang="ts">
import type { SummaryHabit } from '@api/types'
import Card from 'primevue/card'
import EntriesCarousel from './EntriesCarousel.vue'
import GoalDescription from './GoalDescription.vue'

const props = defineProps<{ habit: SummaryHabit }>()
</script>

<template>
  <Card>
    <template #title>{{ props.habit.name }}</template>
    <template #content>
        <GoalDescription
          :goal="props.habit.goal"
          :goalTimespan="props.habit.goalTimespan"
          :goalType="props.habit.goalType"
          :goalFrom="props.habit.goalFrom"
          :goalTo="props.habit.goalTo"
        />
        <EntriesCarousel class="entries-carousel" :entries="props.habit.entries"/>
    </template>
  </Card>
</template>

<style lang="css" scoped>
.entries-carousel {
  padding: var(--p-padding-l);
}
</style>