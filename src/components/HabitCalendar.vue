<script lang="ts" setup>
import dayjs, { isSameDay, listDaysBetween, now, weekDays } from '@/lib/date';
import { countTo } from '@/lib/utils';
import type { Entry } from '@api/types';
import type { Dayjs } from 'dayjs';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';

import { computed, ref } from 'vue';

type View = 'week' | 'month'

type Props = {
  entries: Entry[]
  onAddEntry: (date: Dayjs) => void
  initialView?: View
}

type Slot = {
  entries: Entry[]
  date: Dayjs
}

const props = defineProps<Props>()

const view = ref<View>(props.initialView ?? 'month')

const currentRange = ref<[Dayjs, Dayjs]>([
  now().startOf(view.value),
  now().endOf(view.value)
])

const currentMonthName = computed(() => {
  return currentRange.value[0].format('MMM YYYY')
})

const currRangeName = computed(() => {
  return currentRange.value[0].format('ddd D')
    + ' - '
    + currentRange.value[1].format('ddd D')
})

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
  if (view.value === 'week') {
    return slots.value
  }
  const firstDay = currentRange.value[0].day()
  const firstDayOffset = (firstDay === 0 ? 6 : firstDay - 1)
  return [...Array(firstDayOffset).fill(null), ...slots.value]
})

const toPrev = () => {
  const [oldStart] = currentRange.value
  const newStart = oldStart.add(-1, 'day').startOf(view.value)
  const newEnd = newStart.endOf(view.value)
  currentRange.value = [newStart, newEnd]
}

const toNext = () => {
  const [, oldEnd] = currentRange.value
  const newStart = oldEnd.add(1, 'day').startOf(view.value)
  const newEnd = newStart.endOf(view.value)
  currentRange.value = [newStart, newEnd]
}
const toToday = () => {
  currentRange.value = [now().startOf(view.value), now().endOf(view.value)]
}
const changeView = () => {
  view.value = view.value === 'month' ? 'week' : 'month'
  currentRange.value = [now().startOf(view.value), now().endOf(view.value)]
}
</script>

<!-- TODO: week view should start from monday -->

<template>
  <div class="calendar-container">
    <div class="header">
      <ButtonGroup>
        <Button
          @click="toPrev"
          icon="pi pi-caret-left"
          severity="secondary"
          variant="outlined"
        />
        <Button
          @click="toNext"
          icon="pi pi-caret-right"
          severity="secondary"
          variant="outlined"
        />
        <Button
          @click="changeView"
          :label="view === 'month' ? 'week' : 'month'"
          severity="secondary"
          variant="outlined"
        />
      </ButtonGroup>
      <h2>{{ currentMonthName }} {{currRangeName}}</h2>
      <Button
        @click="toToday"
        label="Today"
        severity="secondary"
        variant="outlined"
        rounded
        :disabled="
          (view === 'month' && now().month() === currentRange[0].month())
          || (view === 'month' && now().startOf('week') === currentRange[0])
        "
      />
    </div>
    
    <div v-if="view === 'month'" class="month-calendar">
      <div v-for="index in countTo(6)" :key="index" class="ellipsable">
        <span>{{ weekDays[index] }}</span>
      </div>
      <div
        v-for="(slot, index) in slotsWithPadding"
        :class="'day'+`${slot?.date && isSameDay(now(), slot.date) ? ' today' : ''}`"
        :key="index"
      >
        <template v-if="slot">
          <span>
            {{ slot.date.date() }}
          </span>
          <div class="day-body">
            <div v-for="{id} in slot.entries" :key="id" class="event-indicator" />
          </div>
          <div class="day-footer">
            <Button
              @click="onAddEntry(slot.date)"
              icon="pi pi-plus"
              size="small"
              variant="text"
            />
          </div>
        </template>
      </div>
    </div>
    <div v-else-if="view === 'week'" class="week-calendar">
      <template v-for="(slot, index) in slotsWithPadding" :key="index">
        <span v-if="slot" class="weekday">{{ slot.date.format('ddd D') }}</span>
        <div
          v-if="slot"
          :class="'day'+`${slot?.date && isSameDay(now(), slot.date) ? ' today' : ''}`"
        >
            <div class="day-body">
              <div v-for="{id} in slot.entries" :key="id" class="event-indicator" />
            </div>
            <div class="day-footer">
              <Button
                @click="onAddEntry(slot.date)"
                icon="pi pi-plus"
                size="small"
                variant="text"
              />
            </div>
        </div>
      </template>
    </div>


  </div>
</template>

<style scoped>
.calendar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: var(--p-gap-m);

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: inherit;
    
    gap: var(--p-gap-xs);
    h2 {
      white-space: nowrap;
    }
  }

  .week-calendar {
    display: grid;
    grid-template-columns: 1fr 5fr;
    grid-template-rows: repeat(2, 1fr);
    gap: var(--p-gap-s);
    align-items: center;
    width: inherit;
    
    .weekday {
      white-space: nowrap;
    }
  }

  .month-calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--p-gap-s);
    width: inherit;
  }

  .day {
    display: flex;
    flex-direction: column;

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
      gap: var(--p-gap-xs);
      flex-grow: 1;
      padding: var(--p-padding-xs);

      .event-indicator {
        width: 100%;
        height: 10px;
        background-color: var(--p-primary-500);
        border-radius: 3px;
      }
    }

    .day-footer {
      button {
        width: 100%;
        height: 1rem;
      }
    }
  }
}
</style>
