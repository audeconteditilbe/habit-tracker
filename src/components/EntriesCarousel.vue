<script lang="ts" setup>
import dayjs, { daysAgo, daysBetween, formatDate, now } from '@/lib/date'
import { BREAKPOINT_SMALL } from '@/lib/ui'
import type { SummaryHabit } from '@api/types'
import Carousel, { type CarouselResponsiveOptions } from 'primevue/carousel'
import { computed, ref } from 'vue'

type Props = Pick<SummaryHabit, 'entries'> & {
  timespan?: number
}

type SummaryDay = {
  date: string,
  entryIds: number[]
}

const NUM_VISIBLE_SMALL = 1
const NUM_SCROLL_SMALL = 1
const NUM_VISIBLE_DEFAULT = 7
const NUM_SCROLL_DEFAULT = 7

const { entries, timespan = 10 } = defineProps<Props>()

const responsiveOptions = ref<CarouselResponsiveOptions[]>([
  {
    breakpoint: `${BREAKPOINT_SMALL}px`,
    numVisible: NUM_VISIBLE_SMALL,
    numScroll: NUM_SCROLL_SMALL
  },
])

const datesWithEntries = computed<SummaryDay[]>(() => 
  daysBetween(daysAgo(timespan - 1), now())
    .reverse()
    .map((date) => {
      return {
        date: formatDate(date),
        entryIds: entries
          .filter(({ date: entryDate }) => dayjs(entryDate).isSame(date, 'day'))
          .map(({ id }) => id)
      }
    })
)

const isLastPage = ref<boolean>(false)

// TODO: make responsive
const lastPage = computed(() => {
  const numVisible = window.innerWidth <= BREAKPOINT_SMALL ? NUM_VISIBLE_SMALL : NUM_VISIBLE_DEFAULT
  const numScroll = window.innerWidth <= BREAKPOINT_SMALL ? NUM_SCROLL_SMALL : NUM_SCROLL_DEFAULT
  return Math.ceil((timespan - numVisible) / numScroll)
})
const handlePageChange = (page: number) => {
  isLastPage.value = page === lastPage.value
}

</script>

<template>
  <Carousel
    :value="datesWithEntries"
    :showIndicators=false
    :numVisible="NUM_VISIBLE_DEFAULT"
    :numScroll="NUM_SCROLL_DEFAULT"
    :responsiveOptions="responsiveOptions"
    @update:page="handlePageChange"
  >
    <template #item="slotProps">
      <div class="entry-item" :title="formatDate((slotProps.data as SummaryDay).date)">
        <i
          v-if="(slotProps.data as SummaryDay).entryIds.length > 0"
          class="pi pi-check"
          style="color: var(--success-color)"
        />
        <i v-else class="pi pi-circle" style="color: var(--error-color)" />
        <span>{{dayjs((slotProps.data as SummaryDay).date).fromNow()}}</span>
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
</style>