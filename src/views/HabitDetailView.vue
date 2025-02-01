<script setup lang="ts">
import { RestClientSingleton } from '@/clients'
import AddEntryDrawer from '@/components/AddEntryDrawer'
import HabitCalendar from '@/components/HabitCalendar/HabitCalendar.vue'
import ProtectedRoute from '@/components/ProtectedRoute.vue'
import TimeProgressBar from '@/components/TimeProgressBar.vue'
import dayjs, { countDays, findDateBucket, now } from '@/lib/date'
import { is } from '@/lib/utils'
import type { Entry, Habit } from '@api/types'
import Card from 'primevue/card'
import Knob from 'primevue/knob'
import ProgressSpinner from 'primevue/progressspinner'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const habit = ref<Habit>()
const entries = ref<Entry[]>([])
const nextLink = ref<string>()

const fetchingHabit = ref<boolean>(true)
const fetchingEntries = ref<boolean>(true)

const sessionLifespan = ref<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
const entryCountInSession = ref<number>(0)
const globalProgress = ref<number>(0)

const entryDrawerVisible = ref<boolean>(false)
const selectedDate = ref<dayjs.Dayjs | undefined>()

const remainingDaysInSession = computed<number | null>(() => {
  if (sessionLifespan.value) {
    const count = countDays(now(), sessionLifespan.value[1])
    if (is(count)) {
      return count + 1
    }
  }
  return null
})

const remainingDaysGlobal = computed<number | null>(() => {
  if (habit.value?.goalFrom && habit.value.goalTo) {
    const count = countDays(now(), habit.value.goalTo)
    if (is(count)) {
      return count +1
    }
  }
  return null
})

const sessionGoalStatus = computed<'fail' | 'success' | 'pending'>(() => {
  if (is(habit.value?.goal) && is(entryCountInSession.value)) {
    switch (habit.value.goalType) {
      case 'EQUAL': {
        if (entryCountInSession.value > habit.value.goal) {
          return 'fail'
        }
        
        if (entryCountInSession.value === habit.value.goal) {
          return 'success'
        }
        return 'pending'
      }
      case 'LT': {
        if (entryCountInSession.value >= habit.value.goal) {
          return 'fail'
        }
        return 'pending'
      }
      case 'LTE': {
        if (entryCountInSession.value > habit.value.goal) {
          return 'fail'
        }
        return 'pending'
      }
      case 'GT': {
        if (entryCountInSession.value > habit.value.goal) {
          return 'success'
        }
        return 'pending'
      }
      case 'GTE': {
        if (entryCountInSession.value >= habit.value.goal) {
          return 'success'
        }
        return 'pending'
      }
    }
  }
  return 'pending'
})

// const visible = ref<boolean>(false)
const onUpdateVisible = ref<(val: boolean) => void>((val) => {
  // visible.value = val
  if (!val) {
    selectedDate.value = undefined
  }
})

const onAddEntry = (date: dayjs.Dayjs) => {
  entryDrawerVisible.value = true
  selectedDate.value = date
  // visible.value = true
}

// TODO: handle pagination!
const fetchEntries = (range?: [dayjs.Dayjs, dayjs.Dayjs]) => {
  if (!habit.value) {
    return
  }

  RestClientSingleton
    .getEntries({
      habitId: `${habit.value.id}`,
      timeEnd: range?.[1].toISOString(),
      timeStart: range?.[0].toISOString(),
    })
    .then(({ count, results, next }) => {
      if (!range) {
        globalProgress.value = count
      }
      entries.value = results
      nextLink.value = next ?? undefined
    })
    .catch((err) => {
      // TODO
      console.error('Error fetching entries', err)
    })
    .finally(() => {
      fetchingEntries.value = false
    })
}

const addEntry = (values: Omit<Entry, 'id' | 'habit'>) => {
  if (!habit.value) { return }

  return RestClientSingleton.addEntry({
    ...values,
    habit: habit.value.id,
  })
  .then((entry) => {
    entries.value.push(entry)
    // fetchEntries()
  })
  .catch((err) => {
    // TODO
    console.error('Error creating entry', err)
  })
  .finally(() => {
    selectedDate.value = undefined
  })
}

onMounted(async () => {
  const habitId = route.params.id
  if (typeof habitId !== 'string') { return }

  try {
    habit.value = await RestClientSingleton.getHabit(parseInt(habitId))
  } catch (err) {
    // TODO
    console.error('Error fetching habit', err)
  }
  fetchingHabit.value = false
  if (!habit.value) {
    return
  }

  const { goalFrom, goalTo, goalTimespan } = habit.value
  if (goalFrom && goalTo && goalTimespan) {
    sessionLifespan.value = findDateBucket(goalFrom, goalTo, goalTimespan, now())
    
    // TODO use count endpoint once available
    if (sessionLifespan.value) {
      const [timeStart, timeEnd] = sessionLifespan.value
      
      RestClientSingleton
        .getEntries({
          habitId: `${habit.value.id}`,
          timeEnd: timeEnd.toISOString(),
          timeStart: timeStart.toISOString()
        })
        .then(({ count }) =>  entryCountInSession.value = count)
        .catch((err) => {
          // TODO
          console.error('Error fetching entries', err)
        })
    }
  }

  fetchEntries()
})
</script>

<template>
  <ProtectedRoute>
    <div v-if="fetchingHabit" class="habit-detail-loading-view">
      <ProgressSpinner />
    </div>
    <div v-else-if="habit" class="habit-detail-view">
      
      <div class="title">
        <h2>{{ habit.name }}</h2>
        <p class="text-subtle">{{ habit.description }}</p>
      </div>

      <div class="summary">
        <!-- Time progression -->
        <Card class="time-progress-card" v-if="habit.goal && globalProgress && habit.goalFrom && habit.goalTo">
          <template #title>
            <h4>Progression</h4>
          </template>
          <template #content>
            <TimeProgressBar :from="habit.goalFrom" :to="habit.goalTo" />
          </template>
        </Card>
        
        <!-- Goal progression (global) -->
        <Card class="session-progress-card" v-if="habit.goal && !habit.goalTimespan && globalProgress">
          <template #title>
            <h4>Goal</h4>
          </template>
          <template #content>
            <div class="session-progress-content">
              <Knob
                readonly
                :stroke-width="8"
                :min="0"
                :max="habit.goal"
                :value-template="`${globalProgress} / ${habit.goal}`"
                :model-value="globalProgress"
                :valueColor="sessionGoalStatus === 'fail'
                  ? 'var(--error-color)'
                  : sessionGoalStatus === 'success'
                    ? 'var(--success-color)'
                    : undefined
                "
              />
              <p v-if="
                remainingDaysGlobal
                && remainingDaysGlobal > 1
                && habit.goal > globalProgress
              ">
                {{ remainingDaysGlobal }} days remaining to register
                {{ habit.goal - globalProgress }} entries!
              </p>
              <p v-else-if="remainingDaysGlobal === 1 && habit.goal > globalProgress">
                Today is the last day to register {{ habit.goal - globalProgress }}
                entries!
              </p>
              <p v-else-if="habit.goal <= globalProgress">
                You achieved your goal! Great job!
              </p>
            </div>
          </template>
        </Card>
        <!-- Goal progression (current cycle) -->
        <Card class="session-progress-card" v-else-if="habit.goal && habit.goalTimespan">
          <template #title>
            <h4>Current goal</h4>
          </template>
          <template #content>
            <TimeProgressBar v-if="sessionLifespan" :from="sessionLifespan[0]" :to="sessionLifespan[1]" />
            <div class="session-progress-content">
              <Knob
                readonly
                :stroke-width="8"
                :min="0"
                :max="habit.goal"
                :value-template="`${entryCountInSession} / ${habit.goal}`"
                :model-value="Math.min(entryCountInSession, habit.goal)"
                :valueColor="sessionGoalStatus === 'fail'
                  ? 'var(--error-color)'
                  : sessionGoalStatus === 'success'
                    ? 'var(--success-color)'
                    : undefined"
              />
              <p v-if="
                remainingDaysInSession
                && remainingDaysInSession > 1
                && habit.goal > entryCountInSession
              ">
                {{ remainingDaysInSession }} days remaining to register
                {{ habit.goal - entryCountInSession }} entries!
              </p>
              <p v-else-if="remainingDaysInSession === 1 && habit.goal > entryCountInSession">
                Today is the last day to register {{ habit.goal - entryCountInSession }}
                entries!
              </p>
              <p v-else-if="habit.goal <= entryCountInSession">
                You achieved your goal! Great job!
              </p>
            </div>
          </template>
        </Card>
      </div>

      <!-- Calendar -->
      <Card>
        <template #content>
          <ProgressSpinner v-if="fetchingEntries" />
          <HabitCalendar
            v-else
            :entries="entries"
            @add-entry="onAddEntry"
            @change-range="fetchEntries"
          />
        </template>
      </Card>
    </div>
    
    <!-- Creation Drawer -->
    <AddEntryDrawer
      v-if="habit?.id !== undefined"
      :visible="Boolean(selectedDate)"
      @update-visible="onUpdateVisible"
      :habitId="`${habit.id}`"
      :initialValues="{date: selectedDate?.toISOString()}"
      @submit="addEntry"
    />

  </ProtectedRoute>
</template>

<style lang="css" scoped>
.habit-detail-loading-view {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.habit-detail-view {
  display: flex;
  flex-direction: column;
  gap: var(--p-gap-m);
  
  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .summary {
    display: flex;
    flex-direction: row;
    gap: var(--p-gap-m);
    flex-wrap: wrap;

    .time-progress-card {
      flex-grow: 1;
      min-width: 15rem;
    }
    
    .session-progress-card {
      flex-grow: 1;
      min-width: 15rem;
      
      .session-progress-content {
        display: flex;
        align-items: center;
        gap: var(--p-gap-m);
      }
    }
  }
}
</style>