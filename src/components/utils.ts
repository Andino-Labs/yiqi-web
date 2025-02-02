const extractGmtOffset = (timezoneLabel: string) => {
  const regex = /GMT([+-]\d+)(?::(\d{2}))?/
  const match = timezoneLabel.match(regex)!
  const hours = parseInt(match[1], 10)
  const minutes = match[2] ? parseInt(match[2], 10) : 0
  return hours + minutes / 60
}

export const formatDateByTimezoneLabel = (
  dateString: Date,
  timezoneLabel: string
): string => {
  const utcDate = dateString
  const offsetHours = extractGmtOffset(timezoneLabel)

  const offsetMillis = offsetHours * 60 * 60 * 1000
  const adjustedDate = new Date(utcDate.getTime() + offsetMillis)

  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  })
  return `${formatter.format(adjustedDate)} ${timezoneLabel}`
}

export const formatDurationByTimezoneLabel = (
  startDate: Date,
  endDate: Date,
  timezoneLabel: string
): string => {
  const offsetHours = extractGmtOffset(timezoneLabel)

  const offsetMillis = offsetHours * 60 * 60 * 1000
  const adjustedStartDate = new Date(startDate.getTime() + offsetMillis)
  const adjustedEndDate = new Date(endDate.getTime() + offsetMillis)

  const formatterDateAndTime = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  })
  const formatterTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  })
  return `${formatterDateAndTime.format(adjustedStartDate)} - ${formatterTime.format(adjustedEndDate)}  ${timezoneLabel}`
}
