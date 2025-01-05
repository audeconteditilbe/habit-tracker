export const formatDate = (date: Date) => {
  return date.toLocaleString("en-US")
}

export const formatDateFromISO = (dateIso: string) => {
  return formatDate(new Date(dateIso))
}
