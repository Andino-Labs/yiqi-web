import { isAfter, isBefore, subMinutes } from 'date-fns'

/**
 * Checks if an event is ongoing based on the current date and time.
 * @param startDate - The start date of the event.
 * @returns `true` if the event is ongoing, otherwise `false`.
 */
export const isOngoingEvent = (startDate: Date, endDate: Date): boolean => {
  const now = new Date()

  const tenMinutesBefore = subMinutes(startDate, 10)

  const isOngoing = isAfter(now, tenMinutesBefore) && isBefore(now, endDate)

  return isOngoing
}
