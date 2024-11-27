'use client'

import { EventRegistrationSchemaType } from '@/schemas/eventSchema'
import { getEventRegistrationsByUserId } from '@/services/actions/eventActions'
import { useEffect, useState } from 'react'

// TODO add the user ticket list
// registration has can have more than one ticket.
// In this screen we should show the use user event page and if they click into it show them their tickets using the UserTicket component
export default function UserEventList({ userId }: { userId: string }) {
  const [registrations, setRegistrations] = useState<
    EventRegistrationSchemaType[]
  >([])

  console.log(registrations)
  useEffect(() => {
    const fetchRegistrations = async () => {
      const registrations = await getEventRegistrationsByUserId(userId)
      setRegistrations(registrations)
    }
    fetchRegistrations()
  }, [userId])

  return <div>UserEventList</div>
}
