<script setup lang="ts">
import type { Dateable } from '@/lib/date';
import dayjs from '@/lib/date';
import { computed } from 'vue';

import type { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/vue3';
// import interactionPlugin from '@fullcalendar/interaction'

type Event = {
  date: Dateable
}

type Props = {
  events: Event[]
}

const props = defineProps<Props>()

const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [ dayGridPlugin ],
  initialView: 'dayGridMonth',
  contentHeight: 'auto',
  firstDay: 1,
  fixedWeekCount: false,
  events: props.events.flatMap(({ date }) => ([{
    date: dayjs(date).toDate(),
    allDay: true
  }])),
  eventColor: 'var(--p-primary-500)',
  eventDisplay: 'block',
}))
</script>

<template>
  <FullCalendar :options="calendarOptions" />
</template>
