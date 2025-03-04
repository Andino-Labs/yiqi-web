import TicketsPage from '@/components/tickets/ticketPage/TicketPage'
import UserLayout from '@/components/user/UserLayout'
import { getUser } from '@/lib/auth/lucia'
import isNetworkingDataFilled from '@/lib/utils/isNetworkingDataFilled'
import { profileDataSchema } from '@/schemas/userSchema'
import { getTicketsWithEvents } from '@/services/actions/tickets/ticketActions'
import { getUserProfile } from '@/services/actions/userActions'
import React from 'react'
import { getTranslations } from 'next-intl/server'

export default async function Tickets() {
  const userCurrent = await getUser()
  const t = await getTranslations('Ticket')

  if (!userCurrent?.id) {
    return <div>{t('userNotFound')}</div>
  }

  const user = await getUserProfile(userCurrent.id)
  const tickets = await getTicketsWithEvents(userCurrent.id)

  if (!user) {
    return <div>{t('userNotFound')}</div>
  }

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
