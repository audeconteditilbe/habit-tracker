<script lang="ts" setup>
import dayjs, { isSameDay, listDaysBetween, now, weekDays } from '@/lib/date';
import { countTo } from '@/lib/utils';
import type { Entry } from '@api/types';
import type { Dayjs } from 'dayjs';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';

import { computed, ref } from 'vue';

type Props = {
  entries: Entry[]
}
type Slot = {
  entries: Entry[]
  date: Dayjs
}

const props = defineProps<Props>()

const currentRange = ref<[Dayjs, Dayjs]>([now().startOf('month'), now().endOf('month')])

const firstDayOffset = computed(() => {
  const firstDay = currentRange.value[0].day()
  return (firstDay === 0 ? 6 : firstDay - 1)
})

const currentMonthName = computed(() => currentRange.value[0].format('MMMM YYYY'))

const entriesByIsoDate = computed(() =>
  props.entries.reduce<Record<string, Entry[]>>((acc, entry) => {
    const { date } = entry
    const key = dayjs(date).startOf('day').toISOString()
    if (!(key in acc)) {
      acc[key] = []
    }
    acc[key].push(entry)
    return acc
  }, {})
)

const slots = computed<Slot[]>(() => {
  const [start, end] = currentRange.value
  return listDaysBetween(start, end).map((date) => {
    const key = date.toISOString()
    const entries: Entry[] = entriesByIsoDate.value[key] ?? []
    return { entries, date }
  })
})

const slotsWithPadding = computed<(Slot | null)[]>(() => {
  const emptySlots = Array(firstDayOffset.value).fill(null)
  return [...emptySlots, ...slots.value]
})

const nextMonth = () => {
  const [, oldEnd] = currentRange.value
  const newStart = oldEnd.add(1, 'day').startOf('month')
  const newEnd = newStart.endOf('month')
  currentRange.value = [newStart, newEnd]
}
const prevMonth = () => {
  const [oldStart] = currentRange.value
  const newStart = oldStart.add(-1, 'day').startOf('month')
  const newEnd = newStart.endOf('month')
  currentRange.value = [newStart, newEnd]
}
const currMonth = () => {
  currentRange.value = [
    now().startOf('month'),
    now().endOf('month')
  ]
}
</script>

<template>
  <div class="calendar-container">
    <div class="header">
      <ButtonGroup>
        <Button
          @click="prevMonth"
          icon="pi pi-caret-left"
          severity="secondary"
          variant="outlined"
        />
        <Button
          @click="nextMonth"
          icon="pi pi-caret-right"
          severity="secondary"
          variant="outlined"
        />
      </ButtonGroup>
      <h2>{{ currentMonthName }}</h2>
      <Button
        @click="currMonth"
        label="Today"
        severity="secondary"
        variant="outlined"
      />
    </div>
    <div class="calendar">
      <div class="ellipsable" v-for="index in countTo(6)" :key="index" >
        <span>{{ weekDays[index] }}</span>
      </div>
      <div
        v-for="(slot, index) in slotsWithPadding"
        :class="'day'+`${slot?.date && isSameDay(now(), slot.date) ? ' today' : ''}`"
        :key="index"
      >
        <template v-if="slot">
          <span>{{ slot.date.date() }}</span>
          <div class="day-body">
            <div v-for="{id} in slot.entries" :key="id" class="event-indicator" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    width: inherit;
  }
  
  .calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--p-gap-s);
    width: inherit;
    
    .day {
      position: relative;
      border: 1px solid #ddd;
      text-align: center;
      border-radius: 5px;
      min-height: 5rem;
      
      &.today {
        /* TODO handle bright mode */
        background-color: var(--p-surface-700);
      }

      .day-body {
        display: flex;
        flex-direction: column;
        padding: var(--p-padding-xs);
        gap: var(--p-gap-xs);

        .event-indicator {
          width: 100%;
          height: 10px;
          background-color: var(--p-primary-500);
        }
      }
    }
  }
}
</style>
