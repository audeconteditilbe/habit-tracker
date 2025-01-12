<script setup lang="ts">
import { RestClientSingleton } from '@/clients'
import ProtectedRoute from '@/components/ProtectedRoute.vue'
import TimeProgressBar from '@/components/TimeProgressBar.vue'
import dayjs, { countDays, findDateBucket, now } from '@/lib/date'
import { is } from '@/lib/utils'
import type { Entry, Habit } from '@api/types'
import Card from 'primevue/card'
import DatePicker from 'primevue/datepicker'
import Knob from 'primevue/knob'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const habit = ref<Habit>()
const entries = ref<Entry[]>([])
const nextLink = ref<string>()

const dates = computed(() => {
  return entries.value.map(({date}) => new Date(date))
})

const sessionLifespan = ref<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
const entryCountInSession = ref<number>(0)
const globalProgress = ref<number>(0)

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

onMounted(async () => {
  const habitId = route.params.id
  if (typeof habitId !== 'string') { return }

  try {
    habit.value = await RestClientSingleton.getHabit(parseInt(habitId))
  } catch (err) {
    // TODO
    console.error('Error fetching habit', err)
  }

  if (!habit.value) {
    return
  }

  const { goalFrom, goalTo, goalTimespan } = habit.value
  
  if (goalFrom && goalTo && goalTimespan) {
    sessionLifespan.value = findDateBucket(goalFrom, goalTo, goalTimespan, now())
  }

  if (sessionLifespan.value) {
    const [timeStart, timeEnd] = sessionLifespan.value
    
    RestClientSingleton
      .getEntries({
        habitId: `${habit.value.id}`,
        timeEnd: timeEnd.toISOString(),
        timeStart: timeStart.toISOString()
      })
      .then(({ count }) => entryCountInSession.value = count)
      .catch((err) => {
        // TODO
        console.error('Error fetching entries', err)
      })
  }

  if (goalFrom && goalTo) {
    RestClientSingleton
      .getEntries({ habitId: `${habit.value.id}` })
      // TODO: handle pagination!
      .then(({ count, results, next }) => {
        globalProgress.value = count
        entries.value = results
        nextLink.value = next ?? undefined
      })
      .catch((err) => {
        // TODO
        console.error('Error fetching entries', err)
      })
  }
})
</script>

<template>
  <ProtectedRoute>
    <div v-if="habit" class="habit-detail-view">
      
      <h3>{{ habit.name }}</h3>
      <p class="text-subtle">
        {{ habit.description }}
      </p>

      <!-- <Card v-if="globalProgress && habit.goalFrom && habit.goalTo">
        <template #title>
          <h4>Tracking period</h4>
        </template>
        <template #content>
          <TimeProgressBar
            v-if="habit.goalFrom && habit.goalTo"
            :from="habit.goalFrom"
            :to="habit.goalTo"
            :progress="globalProgress"
          />
        </template>
      </Card> -->

      <Card v-if="habit.goal && globalProgress && habit.goalFrom && habit.goalTo">
        <template #title>
          <h4>Progression</h4>
        </template>
        <template #content>
          <TimeProgressBar
            :from="habit.goalFrom"
            :to="habit.goalTo"
          />
        </template>
      </Card>
      
      <Card v-if="habit.goal && !habit.goalTimespan && globalProgress">
        <template #title>
          <h4>Goal</h4>
        </template>
        <template #content>
          <div class="session-progress">
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

      <Card v-else-if="habit.goal && habit.goalTimespan">
        <template #title>
          <h4>Current goal</h4>
        </template>
        <template #content>
          <TimeProgressBar v-if="sessionLifespan" :from="sessionLifespan[0]" :to="sessionLifespan[1]" />
          <div class="session-progress">
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
                  : undefined
              "
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

      <!-- TODO: prevent date selection -->
      <DatePicker

        :model-value="dates"
        @update:model-value="(next) => {
          console.log(dates)
          console.log(next)
          return dates
        }"
        selectionMode="multiple"
        inline
        class="w-full sm:w-[30rem]"
      >
        <!-- <template #date="props">
          <div @click="null">{{props.date.day}}</div>
        </template> -->
      </DatePicker>
    </div>
  </ProtectedRoute>
</template>

<style lang="css" scoped>
.habit-detail-view {
  display: flex;
  flex-direction: column;
  gap: var(--p-gap-m);
}
.session-progress {
  display: flex;
  align-items: center;
  gap: var(--p-gap-m);
}
</style>