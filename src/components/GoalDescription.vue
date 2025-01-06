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
  
  if (goalFrom || goalTo) {
    if (goalFrom) {
      messages.push(`from ${formatDate(goalFrom)}`)
    }
    if (goalTo) {
      messages.push(`until ${formatDate(goalTo)}`)
    }
  }

  if (goal) {
    switch (goalType) {
      case 'GT':
        messages.push(`more than ${goal} times`)
        break
      case 'GTE':
        messages.push(`at least ${goal} times`)
        break
      case 'LT':
        messages.push(`less than ${goal} times`)
        break
      case 'LTE':
        messages.push(`at most ${goal} times`)
        break
      case 'EQUAL':
        messages.push(`${goal} times`)
        break
    }
    if (goalTimespan) {
      messages.push(`every ${goalTimespan} days`)
    }
  }

  return messages.join(' ')
})
</script>

<template>
  <span class="subtle-text">{{ goalMessage }}</span>
</template>