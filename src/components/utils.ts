const extractGMTOffset = (timezoneLabel: string) => {
  const regex = /GMT([+-]\d+)(?::(\d{2}))?/
  const match = timezoneLabel.match(regex)!
  const hours = parseInt(match[1], 10)
  const minutes = match[2] ? parseInt(match[2], 10) : 0
  return hours + minutes / 60
}

export const extractGMTTime = (timezoneString: string): string => {
  const match = timezoneString.match(/\(GMT([+-]\d{1,2}):(\d{2})\)/)
  if (match) {
    const sign = match[1][0]
    const hours = match[1].slice(1).padStart(2, '0')
    const minutes = match[2]
    return `${sign}${hours}:${minutes}`
  }
  return ''
}

export const getDateOrTimeByTimezoneLabel = (
  date: Date,
  timezoneLabel: string,
  part: 'date' | 'time'
) => {
  const offsetHours = extractGMTOffset(timezoneLabel)
  const offsetMillis = offsetHours * 60 * 60 * 1000
  const adjustedDate = new Date(date.getTime() + offsetMillis)

  const formatterTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  })
  return part === 'date'
    ? adjustedDate.toISOString().slice(0, 10)
    : formatterTime.format(adjustedDate)
}

export const formatRangeDatesByTimezoneLabel = (
  startDate: Date,
  timezoneLabel: string,
  endDate?: Date
): string => {
  const offsetHours = extractGMTOffset(timezoneLabel)

  const offsetMillis = offsetHours * 60 * 60 * 1000
  const adjustedStartDate = new Date(startDate.getTime() + offsetMillis)
  const adjustedEndDate = endDate && new Date(endDate.getTime() + offsetMillis)

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
  return `${formatterDateAndTime.format(adjustedStartDate)}${endDate ? ` - ${formatterTime.format(adjustedEndDate)}` : ''} ${timezoneLabel}`
}
