<script lang="ts" setup>
import { formatDate } from '@/lib/date';
import type { SummaryHabit } from '@api/types';
import { computed } from 'vue';
import TimeProgressBar from './TimeProgressBar.vue';

const { 
  goal,
  goalTimespan,
  goalType,
  goalFrom,
  goalTo,
} = defineProps<Pick<
  SummaryHabit,
  | 'goal'
  | 'goalTimespan'
  | 'goalType'
  | 'goalFrom'
  | 'goalTo'
>>()

const goalMessage = computed(() => {
  const messages = []
  if (!goal || !goalType) {
    return undefined
  }

  switch (goalType) {
    case 'GT':
      messages.push(`More than ${goal} times`)
      break
    case 'GTE':
      messages.push(`At least ${goal} times`)
      break
    case 'LT':
      messages.push(`Less than ${goal} times`)
      break
    case 'LTE':
      messages.push(`At most ${goal} times`)
      break
    case 'EQUAL':
      messages.push(`${goal} times`)
      break
  }
  if (goalTimespan) {
    messages.push(`every ${goalTimespan} days`)
  } else {
    messages.push(`in total`)
  }

  return messages.join(' ')
})
</script>

<template>
  <div v-if="goalFrom || goalTo || goalMessage" class="goal-desc-container">
    <TimeProgressBar
      v-if="goalFrom && goalTo"
      :from="goalFrom"
      :to="goalTo"
    />
    <span v-else-if="goalFrom" class="ellipsable">
      Started on: {{ formatDate(goalFrom) }}
    </span>
    <span v-else-if="goalTo" class="ellipsable">
      Ends on: {{ formatDate(goalTo) }}
    </span>
    <div v-if="goalMessage" class="details-row">
      <!-- <i class="pi pi-bullseye" /> -->
      <span class="ellipsable">{{ goalMessage }}</span>
    </div>
  </div>
</template>

<style lang="css" scoped>
.goal-desc-container {
  display: flex;
  flex-direction: column;
  gap: var(--p-gap-s);
  flex-grow: 1;
  line-height: 1;

  .details-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--p-gap-s);
  }
}
</style>