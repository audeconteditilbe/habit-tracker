
export const ORIGIN = new URL(window.location.origin)

export const normalizeUrl = (url: string) => new URL(url, window.location.origin).pathname