<script lang="ts" setup>
import { formatDate } from '@/lib/date'
import type { SummaryHabit } from '@api/types'
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
</script>

<template>
  <div v-if="goalFrom || goalTo || goalMessage" class="container">
    <i class="pi pi-bullseye" />
    <div class="details">
      <div class="from-to">
        <span v-if="goalFrom" class="subtle-text ellipsable">{{ formatDate(goalFrom) }}</span>
        <!-- TODO: adjust size -->
        <i
        v-if="Boolean(goalFrom) && Boolean(goalTo)"
        class="pi pi-arrow-right subtle-text"
        style="font-size: 0.5rem;"
        />
        <span v-if="goalTo" class="subtle-text ellipsable">{{ formatDate(goalTo) }}</span>
      </div>
      <span v-if="goalMessage" class="subtle-text ellipsable">{{ goalMessage }}</span>
    </div>
  </div>
</template>

<style lang="css" scoped>
.container {
  display: flex;
  align-items: center;
  gap: var(--p-gap-s);
}

.details {
  display: flex;
  flex-direction: column;
  gap: var(--p-gap-xs);

  .from-to {
    display: flex;
    flex-direction: row;
    gap: var(--p-gap-s);
    align-items: center;
  }
}
</style>