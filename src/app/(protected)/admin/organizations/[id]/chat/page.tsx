import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import { getOrganizationMessageThreads } from '@/services/actions/communications/getOrganizationMessageThreads'
import { ChatSection } from './ChatSection'
import ChatComponent from '@/components/chat/chat'

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUser()

  const chats = await getOrganizationMessageThreads(params.id)

  if (user) {
    if (user.role === Roles.ADMIN) {
      return (
        <ChatSection orgId={params.id} isActive={false}>
          <ChatComponent chats={chats} />
        </ChatSection>
      )
    } else if (user.role === Roles.NEW_USER) {
      redirect(`/newuser`)
    } else if (user.role == Roles.ANDINO_ADMIN) {
      redirect(`/andino-admin`)
    } else if (user.role === Roles.USER) {
      redirect(`/user`)
    }
  }
}
