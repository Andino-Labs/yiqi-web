import { getOrganization } from '@/services/actions/organizationActions'
import { getEvent, updateEvent } from '@/services/actions/eventActions'
import { redirect } from 'next/navigation'
import { CustomFieldInput, DbEventSchema } from '@/schemas/eventSchema'
import EditEventForm from './EditEventForm' // We'll create this component
import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'

async function getEventData(organizationId: string, eventId: string) {
  const [organization, event, currentUser] = await Promise.all([
    getOrganization(organizationId),
    getEvent(eventId),
    getUser()
  ])

  if (!event) {
    return { notFound: true }
  }

  const isAdmin =
    currentUser && (await isOrganizerAdmin(organizationId, currentUser.id))

  return { organization, event: DbEventSchema.parse(event), isAdmin }
}

export default async function EditEventPage({
  params
}: {
  params: { id: string; eventId: string }
}) {
  const { organization, event, isAdmin, notFound } = await getEventData(
    params.id,
    params.eventId
  )

  if (notFound) {
    return <div>Event not found</div>
  }

  if (!isAdmin) {
    return <div>Unauthorized</div>
  }

  if (!organization || !event) {
    return <div>Organization or Event not found</div>
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    const title = formData.get('title') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const description = formData.get('description') as string
    const customFields = JSON.parse(
      formData.get('customFields') as string
    ) as CustomFieldInput[]

    await updateEvent(params.eventId, {
      title,
      startDate,
      endDate,
      description,
      customFields
    })
    redirect(`/admin/organizations/${params.id}/events`)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Event: {event.title}</h1>
      <EditEventForm
        event={event}
        handleSubmit={handleSubmit}
        organizationId={params.id}
      />
    </div>
  )
}
