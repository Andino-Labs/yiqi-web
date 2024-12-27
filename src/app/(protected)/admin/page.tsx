import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import { getAllOrganizationsForCurrentUser } from '@/services/actions/organizationActions'
import { BeEventAdmin } from '@/components/newuser/newUserActions'

export default async function Page() {
  const user = await getUser()
  if (!user) {
    return redirect(`/auth`)
  }
  const orgs = await getAllOrganizationsForCurrentUser()

  if (orgs.length >= 1) {
    redirect(`/admin/organizations/${orgs[0].id}`)
  } else if (orgs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <BeEventAdmin value={user.id} />
      </div>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect(`/newuser`)
  } else if (user.role === Roles.USER) {
    redirect(`/user`)
  } else if (user.role === Roles.ANDINO_ADMIN) {
    redirect(`/andino-admin`)
  }

  return <div>Loading...</div>
}
