import { getEventRegistrations } from '@/services/actions/event/getEventAttendees'
import { SendMassiveMessagesForm } from './SendMassiveMessagesForm'
import { AttendeeStatus } from '@prisma/client'

const groupAudienceByStatus = (
  users: { userId: string; status: AttendeeStatus }[]
) =>
  users.reduce<{ status: AttendeeStatus; users: string[] }[]>(
    (acc, { status, userId }) => {
      let group = acc.find(g => g.status === status)
      if (!group) {
        group = { status, users: [] }
        acc.push(group)
      }
      group.users.push(userId)
      return acc
    },
    []
  )

export const NotifyMyAudience = async ({ eventId }: { eventId: string }) => {
  const attendees = await getEventRegistrations(eventId)

  return (
    <SendMassiveMessagesForm
      groupAudienceByStatus={groupAudienceByStatus(
        attendees.map(_ => ({
          status: _.status,
          userId: _.user.id
        }))
      )}
    />
  )
}
