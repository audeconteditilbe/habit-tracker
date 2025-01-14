<script lang="ts" setup>
import dayjs, { daysAgo, formatDate, humanReadableDate, listDaysBetween, now } from '@/lib/date'
import { BREAKPOINT_L, BREAKPOINT_M, BREAKPOINT_S, BREAKPOINT_XL, BREAKPOINT_XS } from '@/lib/ui'
import type { Habit, SummaryHabit } from '@api/types'
import Carousel, { type CarouselResponsiveOptions } from 'primevue/carousel'
import { computed, ref } from 'vue'

type Props = Pick<SummaryHabit, 'entries'> & {
  timespan?: number
  goalType?: Habit['goalType']
}

type SummaryDay = {
  date: dayjs.Dayjs,
  entryIds: number[]
}

const NUM_SCROLL_DEFAULT = 1
const NUM_VISIBLE_DEFAULT = 7
const NUM_VISIBLE_L = 4
const NUM_VISIBLE_M = 3
const NUM_VISIBLE_S = 2
const NUM_VISIBLE_XS = 1

const { entries, timespan = 10, goalType } = defineProps<Props>()

const responsiveOptions = ref<CarouselResponsiveOptions[]>([
  {
    breakpoint: `${BREAKPOINT_XL}px`,
    numVisible: NUM_VISIBLE_DEFAULT,
    numScroll: NUM_SCROLL_DEFAULT
  },
  {
    breakpoint: `${BREAKPOINT_L}px`,
    numVisible: NUM_VISIBLE_L,
    numScroll: NUM_SCROLL_DEFAULT
  },
  {
    breakpoint: `${BREAKPOINT_M}px`,
    numVisible: NUM_VISIBLE_M,
    numScroll: NUM_SCROLL_DEFAULT
  },
  {
    breakpoint: `${BREAKPOINT_S}px`,
    numVisible: NUM_VISIBLE_S,
    numScroll: NUM_SCROLL_DEFAULT
  },
  {
    breakpoint: `${BREAKPOINT_XS}px`,
    numVisible: NUM_VISIBLE_XS,
    numScroll: NUM_SCROLL_DEFAULT
  },
])

const datesWithEntries = computed<SummaryDay[]>(() => 
  listDaysBetween(daysAgo(timespan - 1), now())
    .reverse()
    .map((date) => {
      return {
        date,
        entryIds: entries
          .filter(({ date: entryDate }) => dayjs(entryDate).isSame(date, 'day'))
          .map(({ id }) => id)
      }
    })
)

const colors = computed<{ entry: string, empty: string } | undefined>(() => {
  if (goalType === 'LT' || goalType === 'LTE') {
    return {
      entry: 'var(--error-color)',
      empty: 'var(--success-color)',
    }
  }
  if (goalType === 'GT' || goalType === 'GTE') {
    return {
      entry: 'var(--success-color)',
      empty: 'var(--error-color)',
    }
  }
  return undefined
})

</script>

<template>
  <Carousel
    :value="datesWithEntries"
    :showIndicators=false
    :numVisible="NUM_VISIBLE_DEFAULT"
    :numScroll="NUM_SCROLL_DEFAULT"
    :responsiveOptions="responsiveOptions"
  >
    <template #item="slotProps">
      <div class="entry-item" :title="formatDate((slotProps.data as SummaryDay).date)">
        <i
          v-if="(slotProps.data as SummaryDay).entryIds.length > 0"
          class="pi pi-circle-fill"
          :style="colors ? `color: ${colors?.entry}` : undefined"
        />
        <i
          v-else
          class="pi pi-circle"
          :style="colors ? `color: ${colors?.empty}` : undefined"
        />
        <span
          class="small"
        >
          {{ humanReadableDate((slotProps.data as SummaryDay).date) }}
        </span>
      </div>
    </template>
  </Carousel>
 </template>

<style scoped>
.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.small {
  font-size: 0.9rem;
}
</style>