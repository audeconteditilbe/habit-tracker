import { type components, type operations } from './rest-api'

export type EntriesListQuery = Omit<
  operations['entries_list']['parameters']['query'],
  'page'
>

export type Habit = components['schemas']['Habit']
export type Entry = components['schemas']['Entry']

export type SummaryHabit = (
  Pick<Habit, 
    | 'id'
    | 'name'
    | 'private'
    | 'status'
    | 'description'
    | 'goal'
    | 'goalType'
    | 'goalTimespan'
    | 'goalFrom'
    | 'goalTo'
  > & {
    entries: Pick<Entry, 'id' | 'date' | 'description' | 'rating'>[]
  }
)