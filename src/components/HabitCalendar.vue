<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { BREAKPOINT_S } from '@/lib/ui';
import { type CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/vue3';
import type { Entry } from '@api/types';
// import interactionPlugin from '@fullcalendar/interaction'

type Props = {
  entries: Entry[]
}

const props = defineProps<Props>()

const commonOptions: Partial<CalendarOptions> = {
  eventDisplay: 'background',
  headerToolbar: {
    left: 'title',
    right: 'prev,next today',
  },
  firstDay: 1,
  contentHeight: 'auto',
  fixedWeekCount: false,
  eventColor: 'var(--p-primary-500)',
}

const smallScreenOptions = computed<CalendarOptions>(() => ({
  plugins: [ dayGridPlugin ],
  initialView: 'dayGridMonth',
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

  events: props.entries.map(({date}) => ({ date, allDay: true })),
  
  ...commonOptions
}))

const largeCalendarOptions = computed<CalendarOptions>(
  () => ({
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
  events: props.entries.map(({date}) => ({ date, allDay: true })),
  ...commonOptions
}))

const calendarOptions = ref<CalendarOptions>(
  window.innerWidth > BREAKPOINT_S ? largeCalendarOptions.value : smallScreenOptions.value
)
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
