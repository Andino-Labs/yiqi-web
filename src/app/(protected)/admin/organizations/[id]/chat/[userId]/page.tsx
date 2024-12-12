import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import ActiveChatComponent from '@/components/chat/activeChat'
import ConnectedChat from '@/components/chat/connectedChat'
import { getOrganizationMessageThreads } from '@/services/actions/communications/getOrganizationMessageThreads'
import { getUserMessageList } from '@/services/actions/communications/getUserMessageList'
import { ChatSection } from '../ChatSection'

export default async function Page({
  params
}: {
  params: { id: string; userId: string }
}) {
  const user = await getUser()

  if (!user) {
    redirect(`/auth`)
  }

  const chats = await getOrganizationMessageThreads(params.id)
  const messages = await getUserMessageList(params.userId, params.id)
  console.log('messages', messages.length)
  console.log('id ', params.id)

  if (user.role === Roles.ADMIN) {
    return (
      <main className="flex flex-col items-center justify-center">
        <ChatSection orgId={params.id} user={user} isActive={true}>
          <ActiveChatComponent
            orgId={params.id}
            chats={chats}
            activeUserId={params.userId}
          >
            <ConnectedChat
              defaultMessages={messages}
              userId={params.userId}
              orgId={params.id}
              allowedMessageTypes={['email']}
            />
          </ActiveChatComponent>
        </ChatSection>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect(`/newuser`)
  }
}
