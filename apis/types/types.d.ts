import { type components, type operations } from './core'

export type EntriesListQuery = Omit<
  operations['entries_list']['parameters']['query'],
  'page'
>

export type Habit = components['schemas']['Habit']
export type Entry = components['schemas']['Entry']