<script setup lang="ts">
import { countDays, formatDate, now, type Dateable } from '@/lib/date'
import ProgressBar from 'primevue/progressbar'
import { computed } from 'vue'

type Props = {
  from: Dateable
  to: Dateable
  target?: Dateable
}

const MAX_PROGRESS = 95

const props = defineProps<Props>()

const progress = computed<number>(() => {
  const date = props.target ?? now()
  
  if (props.from && props.to) {
    const tot = countDays(props.from, props.to)
    const fromToday = countDays(props.from, date)
    if (tot && fromToday) {
      return Math.min(
        Math.ceil((fromToday / tot) * 100),
        MAX_PROGRESS
      )
    }
    // `target` is after `to`
    if (!fromToday) {
      return 1
    }
    // `from` is after `to`
    if (!tot) {
      return 0
    }
  }
  return 0
})

</script>

<template>
  <div class="time-progress-bar">
    <span class="ellipsable">{{ formatDate(from) }}</span>
    <ProgressBar class="progressbar" :value="progress" :show-value="false"/>
    <span class="ellipsable">{{ formatDate(to) }}</span>
  </div>
</template>

<style lang="css" scoped>
.time-progress-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--p-gap-s);

  .progressbar {
    flex-grow: 1;
  }
}
</style>