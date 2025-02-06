import { getEventRegistrations } from '@/services/actions/event/getEventAttendees'
import { AttendeeStatus } from '@prisma/client'
import { SendMassiveMessagesForm } from './SendMassiveMessagesForm'

const groupEmailsByStatus = (
  registrations: { email: string; status: AttendeeStatus }[]
) => {
  const statusMap = new Map<string, string[]>()
  registrations.forEach(({ email, status }) => {
    if (statusMap.has(status)) statusMap.get(status)!.push(email)
    else statusMap.set(status, [email])
  })
  return Array.from(statusMap, ([status, emails]) => ({
    status,
    emails
  }))
}

export const NotifyMyAudience = async ({ eventId }: { eventId: string }) => {
  const attendees = await getEventRegistrations(eventId)

  return (
    <SendMassiveMessagesForm
      groupEmailsByStatus={groupEmailsByStatus(
        attendees.map(_ => ({ email: _.user.email, status: _.status }))
      )}
    />
  )
}
