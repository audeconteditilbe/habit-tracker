<script lang="ts" setup>
import { countDays, findDateBucket, formatDate, now } from '@/lib/date'
import type { SummaryHabit } from '@api/types'
import ProgressBar from 'primevue/progressbar'
import { computed } from 'vue'

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
  if (!goal) {
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

const progress = computed(() => {
  if (goalFrom && goalTo) {
    const tot = countDays(goalFrom, goalTo)
    const fromToday = countDays(goalFrom, now())
    if (tot && fromToday) {
      return Math.ceil((fromToday / tot) * 100)
    }
  }
  return 0
})

// const currentStreak = computed(() => {
//   if (goal && goalFrom && goalTo && goalTimespan) {
//     const currentTimespan = findDateBucket(goalFrom, goalTo, goalTimespan, goal)
    
//     if (currentTimespan) {
//       const [timespanStart, timespanEnd] = currentTimespan

//     }
//   }

//   return 0
// })
</script>

<template>
  <div v-if="goalFrom || goalTo || goalMessage" class="container">
    
    <div v-if="goalFrom && goalTo" class="details-row">
      <span class="subtle-text ellipsable">{{ formatDate(goalFrom) }}</span>
      <ProgressBar class="progressbar" :value="progress" :show-value="false"/>
      <span class="subtle-text ellipsable">{{ formatDate(goalTo) }}</span>
    </div>
    <span v-else-if="goalFrom" class="subtle-text ellipsable">
      Started on: {{ formatDate(goalFrom) }}
    </span>
    <span v-else-if="goalTo" class="subtle-text ellipsable">
      Ends on: {{ formatDate(goalTo) }}
    </span>
    
    <div v-if="goalMessage" class="details-row">
      <i class="pi pi-bullseye" />
      <span class="subtle-text ellipsable">{{ goalMessage }}</span>
    </div>

  </div>
</template>

<style lang="css" scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: var(--p-gap-s);
  flex-grow: 1;

  .details-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--p-gap-s);

    .progressbar {
      flex-grow: 1;
    }
  }
}
</style>