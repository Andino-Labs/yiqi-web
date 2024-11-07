import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import AdminLayout from '@/components/chat/AdminLayout'
import ActiveChatComponent from '@/components/chat/activeChat'
import ConnectedChat from '@/components/chat/connectedChat'
import {
  getOrganizationMessageThreads,
  getUserMessageList
} from '@/services/actions/messagesActions'
import { BulkSendModal } from '@/components/chat/BulkSendModal'

export default async function Page({
  params
}: {
  params: { id: string; userId: string }
}) {
  const user = await getUser()

  if (!user) {
    redirect('/auth')
  }

  const chats = await getOrganizationMessageThreads(params.id)
  const messages = await getUserMessageList(params.userId, params.id)

  if (user.role === Roles.USER) {
    return (
      <main className="flex flex-col items-center justify-center">
        <AdminLayout
          userProps={{
            picture: user.picture!,
            email: user.email,
            name: user.name
          }}
        >
          <div className="w-full flex justify-end mb-4">
            <BulkSendModal />
          </div>
          <ActiveChatComponent chats={chats} activeUserId={params.userId}>
            <ConnectedChat
              defaultMessages={messages}
              userId={params.userId}
              orgId={params.id}
            />
          </ActiveChatComponent>
        </AdminLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect('/newuser')
  }
}
