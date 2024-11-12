import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import { getAllOrganizationsForCurrentUser } from '@/services/actions/organizationActions'

export default async function Page() {
  const user = await getUser()
  if (!user) {
    return redirect('/auth')
  }
  const orgs = await getAllOrganizationsForCurrentUser()

  if (orgs.length >= 1) {
    redirect(`/admin/organizations/${orgs[0].id}`)
  } else if (user.role === Roles.NEW_USER) {
    redirect('/newuser')
  } else if (user.role === Roles.USER) {
    redirect('/user')
  } else if (user.role === Roles.ANDINO_ADMIN) {
    redirect('/andino-admin')
  }

  return <div>Loading...</div>
}
