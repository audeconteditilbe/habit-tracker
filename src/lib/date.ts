import dayjs, { Dayjs, type ConfigType } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import type { Valid } from './utils'

type Datable = Valid<ConfigType>

export const formatDate = (date: Datable) => {
  return dayjs(date).toDate().toLocaleDateString()
}

export const now = () => dayjs()

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


// centralize dayjs plugin enrichment

dayjs.extend(relativeTime)

export default dayjs