export const normalizeUrl = (url: string) => new URL(url, window.location.origin).pathname

export const buildHabitDetailUrl = (habitId: number) => `/habits/${habitId}`