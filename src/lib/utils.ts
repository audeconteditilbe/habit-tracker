
export type Valid<T> = Exclude<T, undefined | null>

export const is = <T>(input: T): input is Exclude<T, undefined | null> =>
  input !== undefined && input !== null

/**
 * Of ranges that are obtained by splitting the numbers from start to finish into non
 * overlapping buckets of size bucketSize, returns the one containing target.
 * 
 * @example
 * # (0, 1), (2, 3), (4, 5), (6, 7), (8, 9), (10)
 * findBucket(0, 10, 2, 7)
 * > [6, 7]
 * 
 * # (0, 1, 2), (3, 4, 5), (6, 7, 8), (9, 10)
 * findBucket(0, 10, 3, 4)
 * > [3, 5]
 */
export const findBucket = (
  start: number,
  end: number,
  bucketSize: number,
  target: number
): [number, number] | [] => {
  if (target < start || target > end || end < start) {
    return []
  }

  const bucketIndex = Math.floor((target - start) / bucketSize)

  const bucketStart = start + bucketIndex * bucketSize;
  const bucketEnd = Math.min(bucketStart + bucketSize - 1, end)

  return [bucketStart, bucketEnd]
}

export const countTo = (to: number, from: number = 0) =>
  to >= from ? Array.from({ length: to-from+1 }, (_, i) => i + from) : []
