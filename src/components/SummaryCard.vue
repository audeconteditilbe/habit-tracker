<script setup lang="ts">
import type { SummaryHabit } from '@api/types'
import Card from 'primevue/card'
import Button from 'primevue/button'
import EntriesCarousel from './EntriesCarousel.vue'
import GoalDescription from './GoalDescription.vue'
import router from '@/router'
import { buildHabitDetailUrl } from '@/lib/url'

const props = defineProps<{ habit: SummaryHabit }>()

const handleClick = () => {
  router.push(buildHabitDetailUrl(props.habit.id))
}
</script>

<template>
  <Card>
    <template #title>
      <div class="title-content">
        <span class="ellipsable">{{ props.habit.name }}</span>
        <Button
          variant="text"
          icon="pi pi-arrow-right"
          @click.prevent="handleClick"
        />
      </div>
    </template>
    <template #content>
      <GoalDescription
        :goal="props.habit.goal"
        :goalTimespan="props.habit.goalTimespan"
        :goalType="props.habit.goalType"
        :goalFrom="props.habit.goalFrom"
        :goalTo="props.habit.goalTo"
      />
      <EntriesCarousel
        class="entries-carousel"
        :entries="props.habit.entries"
        :goalType="props.habit.goalType"
      />
    </template>
  </Card>
</template>

<style lang="css" scoped>
.entries-carousel {
  padding: var(--p-padding-l);
}
.title-content {
  display: flex;
}
</style>