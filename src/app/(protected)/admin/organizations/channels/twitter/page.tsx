import RedirectPage from '@/components/management-tool/redirectPage/redirectPage'
import { getUser } from '@/lib/auth/lucia'

export default async function TwitterChannel() {
  const user = await getUser()

  if (!user) {
    return <div>User not found</div>
  }

  return <RedirectPage user={user} />
}
