<script lang="ts" setup>
import { formatDateFromISO } from '@/lib/date'
import type { SummaryHabit } from '@api/types'
import { ref } from 'vue'
import Carousel from 'primevue/carousel'

type Props = Pick<SummaryHabit, 'entries'>
type SummaryEntry = Props['entries'][number]

const { entries } = defineProps<Props>()
const responsiveOptions = ref([
  {
    breakpoint: '1400px',
    numVisible: 7,
    numScroll: 1
  },
])
</script>

<template>
  <Carousel :value="entries" :numVisible="4" :numScroll="3" :responsiveOptions="responsiveOptions" :showIndicators=false>
    <template #item="slotProps">
      <div class="entry-item" :title="formatDateFromISO((slotProps.data as SummaryEntry).date)">
        <i class="pi pi-check" />
        <span>{{ formatDateFromISO((slotProps.data as SummaryEntry).date) }}</span>
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