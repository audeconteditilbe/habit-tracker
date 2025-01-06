import dayjs, { Dayjs, type ConfigType } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import calendar from 'dayjs/plugin/calendar'
// import updateLocale from 'dayjs/plugin/updateLocale'

import type { Valid } from './utils'

type Datable = Valid<ConfigType>

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

export const isToday = (date: Datable) => dayjs(date).isSame(now(), 'day')
export const isYesterday = (date: Datable) => dayjs(date).isSame(daysAgo(1), 'day')
export const isThisWeek = (date: Datable) => dayjs(date).isSame(now(), 'week')
export const isThisMonth = (date: Datable) => dayjs(date).isSame(now(), 'month')
export const isThisYear = (date: Datable) => dayjs(date).isSame(now(), 'year')

export const formatDate = (date: Datable) => {
  return dayjs(date).format('L')//.toDate().toLocaleDateString()
}

export const humanReadableDate = (date: Datable) => {
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


export const daysAgo = (span: number, start: Datable = new Date()): Dayjs => {
  return dayjs(start).add(-span, 'day')
}

export const daysForward = (span: number, start: Datable = new Date()): Dayjs => {
  return dayjs(start).add(span, 'day')
}

export const daysBetween = (start: Datable, end: Datable): Dayjs[] => {
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
