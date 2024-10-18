import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import AdminLayout from '@/components/chat/adminLayout'

export default async function Page() {
  const user = await getUser()
  if (!user) {
    redirect('/auth')
  }
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
          contenidooo
        </AdminLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect('/newuser')
  } else if (user.role === Roles.USER) {
    redirect('/user')
  } else if (user.role === Roles.ANDINO_ADMIN) {
    redirect('/andino-admin')
  }
}
