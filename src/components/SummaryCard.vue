<script setup lang="ts">
import { formatDateFromISO } from '@/lib/date';
import type { SummaryHabit } from '@api/types';
import Card from 'primevue/card';
import { computed } from 'vue';
import EntriesCarousel from './EntriesCarousel.vue';

const { habit } = defineProps<{ habit: SummaryHabit }>()

const {
  entries,
  goal,
  goalTimespan,
  goalType,
  goalFrom,
  goalTo,
  name,
} = habit

const goalMessage = computed(() => {
  const messages = []
  
  if (goalFrom || goalTo) {
    if (goalFrom) {
      messages.push(`from ${formatDateFromISO(goalFrom)}`)
    }
    if (goalTo) {
      messages.push(`until ${formatDateFromISO(goalTo)}`)
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
  <Card>
    <template #title>{{ name }}</template>
    <template #content>
        <p class="m-0">
          <span>{{ goalMessage }}</span>
        </p>
        <div class="">
          <!-- {{
            entries.map(({date}) => formatDateFromISO(date))
          }} -->
          <EntriesCarousel :entries="entries"/>
        </div>
    </template>
  </Card>
</template>

