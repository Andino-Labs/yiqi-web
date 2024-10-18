import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import AdminLayout from '@/components/chat/adminLayout'
import ChatComponent from '@/components/chat/chat'
import { getOrganizationMessageThreads } from '@/services/actions/messagesActions'
import { BulkSendModal } from '@/components/chat/BulkSendModal'

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUser()

  if (!user) {
    redirect('/auth')
  }

  const chats = await getOrganizationMessageThreads(params.id)

  if (user.role === Roles.ADMIN) {
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
          <ChatComponent chats={chats} />
        </AdminLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect('/newuser')
  } else if (user.role == Roles.ANDINO_ADMIN) {
    redirect('/andino-admin')
  } else if (user.role === Roles.USER) {
    redirect('/user')
  }
}
