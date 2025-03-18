import TicketsPage from '@/components/tickets/ticketPage/TicketPage'
import UserLayout from '@/components/user/UserLayout'
import isNetworkingDataFilled from '@/lib/utils/isNetworkingDataFilled'
import { profileDataSchema } from '@/schemas/userSchema'
import { getTicketsWithEvents } from '@/services/actions/tickets/ticketActions'
import React from 'react'
import { getUserOrRedirect } from '@/lib/auth/getUserOrRedirect'

export default async function Tickets() {
  const { user } = await getUserOrRedirect()

  const tickets = await getTicketsWithEvents(user.id)

  const userHasNetworkingData = isNetworkingDataFilled(user)

  return (
    <main className="flex flex-col items-center justify-center">
      <UserLayout userProps={profileDataSchema.parse(user)}>
        <TicketsPage
          tickets={tickets}
          userHasNetworkingData={userHasNetworkingData}
        />
      </UserLayout>
    </main>
  )
}
