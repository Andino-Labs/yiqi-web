import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import ActiveChatComponent from '@/components/chat/activeChat'
import ConnectedChat from '@/components/chat/connectedChat'
import { getOrganizationMessageThreads } from '@/services/actions/communications/getOrganizationMessageThreads'
import { getUserMessageList } from '@/services/actions/communications/getUserMessageList'
import { BulkSendModal } from '@/components/chat/BulkSendModal'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'

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
        <OrganizationLayout
          orgId={params.id}
          userProps={{
            picture: user.picture!,
            email: user.email,
            name: user.name,
            id: user.id
          }}
        >
          <div className="w-full flex justify-end mb-4">
            <BulkSendModal allowedMessageTypes={chats.map(chat => chat.type)} />
          </div>
          <ActiveChatComponent chats={chats} activeUserId={params.userId}>
            <ConnectedChat
              defaultMessages={messages}
              userId={params.userId}
              orgId={params.id}
              allowedMessageTypes={chats.map(chat => chat.type)}
            />
          </ActiveChatComponent>
        </OrganizationLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect(`/newuser`)
  }
}
