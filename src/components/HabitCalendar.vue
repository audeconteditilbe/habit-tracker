<script setup lang="ts">
import type { Dateable } from '@/lib/date';
import dayjs from '@/lib/date';
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { BREAKPOINT_S } from '@/lib/ui';
import { type CalendarOptions } from '@fullcalendar/core';
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

const commonOptions = computed<Partial<CalendarOptions>>(() => ({
  eventDisplay: 'background',
  headerToolbar: {
    left: 'title',
    right: 'prev,next today',
  },
  
  firstDay: 1,
  contentHeight: 'auto',
  fixedWeekCount: false,
  events: props.events.flatMap(({ date }) => ([{
    date: dayjs(date).toDate(),
    allDay: true,
  }])),
  eventColor: 'var(--p-primary-500)',
}))

const smallScreenOptions = computed<CalendarOptions>(() => ({
  plugins: [ dayGridPlugin ],
  initialView: 'dayGridMonthLarge',
  viewClassNames: [],
  views: {
    dayGridMonthLarge: {
      type: 'dayGridMonth',
      viewClassNames: ['fc-min-width'],
    },
  },
  footerToolbar: {
    center: 'dayGridMonthLarge,dayGridMonth',
  },
  buttonText: {
    dayGridMonth: 'SMALL',
    dayGridMonthLarge: 'XL',
  },
    
  ...commonOptions.value
}))

const largeCalendarOptions = computed<CalendarOptions>(() => ({
  plugins: [ dayGridPlugin ],
  initialView: 'dayGridMonth',
  viewClassNames: [],
  // views: {
  //   multiHabitMonth: {
  //     type: 'dayGridMonth',
  //     // viewClassNames: ['fc-min-width'],
  //     // TODO: not working
  //     eventDisplay: 'list-item',
  //   }
  // },
  contentHeight: 'auto',
  ...commonOptions.value
}))

const calendarOptions = ref<CalendarOptions>(largeCalendarOptions.value)
const resizeEventHandler = () => {
  if (window.innerWidth > BREAKPOINT_S) {
    calendarOptions.value = largeCalendarOptions.value
  } else {
    calendarOptions.value = smallScreenOptions.value
  }
}

onMounted(() => {
  window.addEventListener("resize", resizeEventHandler)
})
onUnmounted(() => {
  window.removeEventListener("resize", resizeEventHandler)
})
</script>

<template>
  <FullCalendar :options="calendarOptions" />
</template>
