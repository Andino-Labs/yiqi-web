import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'

import { getOrganizationEvents } from '@/services/actions/event/getOrganizationEvents'
import EventSection from '@/components/EventSection'
export const dynamic = 'force-dynamic'

export default async function EventsPage({
  params
}: {
  params: { id: string }
}) {
  const user = await getUser()
  const events = await getOrganizationEvents(params.id)

  if (user) {
    if (user.role === Roles.ADMIN) {
      return <EventSection events={events} orgId={params.id} />
    } else if (user.role === Roles.NEW_USER) {
      redirect(`/newuser`)
    } else if (user.role === Roles.USER) {
      redirect(`/user`)
    }
  }
}
