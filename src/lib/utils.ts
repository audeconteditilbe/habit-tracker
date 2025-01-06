
export type Valid<T> = Exclude<T, undefined | null>

export const is = <T>(input: T): input is Exclude<T, undefined | null> =>
  input !== undefined && input !== null