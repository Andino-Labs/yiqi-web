import { createEvent } from 'ics'
import type { EventAttributes } from 'ics'

// we should do something different here
export async function generateCalendarEvent({
  start,
  end,
  title,
  description,
  location
}: {
  start: Date
  end: Date
  title: string
  description: string
  location?: string
}): Promise<string> {
  const event: EventAttributes = {
    start: [
      start.getFullYear(),
      start.getMonth() + 1,
      start.getDate(),
      start.getHours(),
      start.getMinutes()
    ],
    end: [
      end.getFullYear(),
      end.getMonth() + 1,
      end.getDate(),
      end.getHours(),
      end.getMinutes()
    ],
    title,
    description,
    location
  }

  return new Promise((resolve, reject) => {
    createEvent(event, (error, value) => {
      if (error) {
        reject(error)
      }
      resolve(value)
    })
  })
}
