import type { Entry } from "@api/types"

export type EntryPayload = Omit<Entry, 'id' | 'habit'>

export type Props = {
  visible: boolean
  onUpdateVisible: (visible: boolean) => void
  initialValues: Partial<EntryPayload>
  habitId: string
  onSubmit: (payload: EntryPayload) => void
}
export type EntryFormProps = Omit<Props, 'visible' | 'onUpdateVisible'>