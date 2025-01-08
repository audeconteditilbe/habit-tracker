import dayjs, { Dayjs, type ConfigType } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import calendar from 'dayjs/plugin/calendar'
// import updateLocale from 'dayjs/plugin/updateLocale'

import { findBucket, type Valid } from './utils'

export type Dateble = Valid<ConfigType>

/**
 * NOTE: dayjs should be imported from here for centralizing plugin extension
 */
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(calendar)

// dayjs.extend(updateLocale)
// dayjs.updateLocale('en', {
//   calendar: {
//     lastDay: '[Yesterday] LT',
//     sameDay: '[Today at] LT',
//     nextDay: '[Tomorrow at] LT',
//     lastWeek: '[last] dddd [at] LT',
//     nextWeek: 'dddd [at] LT',
//     sameElse: 'L'
//   }
// })

export default dayjs

/**
 * Utils
 */

const TODAY = 'Today'
const YESTERDAY = 'Yesterday'
const TOMORROW = 'Tomorrow'
const LAST = 'Last'

export const now = () => dayjs()

export const isToday = (date: Dateble) => dayjs(date).isSame(now(), 'day')
export const isYesterday = (date: Dateble) => dayjs(date).isSame(daysAgo(1), 'day')
export const isThisWeek = (date: Dateble) => dayjs(date).isSame(now(), 'week')
export const isThisMonth = (date: Dateble) => dayjs(date).isSame(now(), 'month')
export const isThisYear = (date: Dateble) => dayjs(date).isSame(now(), 'year')

export const formatDate = (date: Dateble) => {
  return dayjs(date).format('L')//.toDate().toLocaleDateString()
}

export const humanReadableDate = (date: Dateble) => {
  date = dayjs(date)
  
  return date.calendar(null, {
    sameDay: `[${TODAY}]`,
    nextDay: `[${TOMORROW}]`,
    nextWeek: 'dddd',
    lastDay: `[${YESTERDAY}]`,
    lastWeek: `[${LAST}] dddd`,
    sameElse: 'L'
  })
}


export const daysAgo = (span: number, start: Dateble = new Date()): Dayjs => {
  return dayjs(start).add(-span, 'day')
}

export const daysForward = (span: number, start: Dateble = new Date()): Dayjs => {
  return dayjs(start).add(span, 'day')
}

export const countDays = (start: Dateble, end: Dateble): number | null => {
  start = dayjs(start).startOf('day')
  end = dayjs(end).endOf('day')
  if (start > end) {
    return null
  }

  return end.diff((start), 'day')
}

export const listDaysBetween = (start: Dateble, end: Dateble): Dayjs[] => {
  const dates: Dayjs[] = []

  const startDate = dayjs(start).startOf('day')
  const endDate = dayjs(end).startOf('day')
  
  if (startDate > endDate) {
    return dates
  }
  
  let latest = startDate
  while (latest <= endDate) {
    dates.push(latest)
    latest = latest.add(1, 'day')
  }
  
  // dates.push(endDate)
  return dates
}

/**
 * Of ranges that are obtained by splitting the days from start to finish into non
 * overlapping buckets of size bucketSize, returns the one containing today's date
 * if any, else null.
 */
export const findDateBucket = (
  start: Dateble,
  end: Dateble,
  bucketSize: number,
  target: Dateble = now()
): [Dayjs, Dayjs] | null => {
  const startDate = dayjs(start)
  const endDate = dayjs(end)
  const targetDate = dayjs(target)

  const daysFromStartToEnd = endDate.diff(startDate, 'day')
  const daysFromStartToTarget = targetDate.diff(startDate, 'day')
  const bucket = findBucket(0, daysFromStartToEnd, bucketSize,  daysFromStartToTarget)

  if (bucket.length === 0) {
    return null
  }

  return [
    startDate.add(bucket[0], 'day'),
    startDate.add(bucket[1], 'day'),
  ]
}