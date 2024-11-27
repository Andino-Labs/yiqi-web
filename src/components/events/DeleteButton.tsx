'use client'
import { deleteEvent } from '@/services/actions/event/deleteEvent'
import { Button } from '@react-email/components'
import { useRouter } from 'next/navigation'

export function DeleteButton(params: {
  eventId: string
  organizationId: string
}) {
  const router = useRouter()

  async function handleOnDelete() {
    await deleteEvent(params.eventId)
    router.push(`/admin/organizations/${params.organizationId}/events`)
  }

  return (
    <Button
      onClick={handleOnDelete}
      className="text-destructive h-10 px-4 py-2 rounded-md cursor-pointer"
    >
      Eliminar
    </Button>
  )
}
