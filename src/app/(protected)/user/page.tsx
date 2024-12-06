import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import { getTranslations } from 'next-intl/server'
import { getUserProfile } from '@/services/actions/userActions'
import UserProfilePage from '@/components/user/UserProfile'
import MainLandingNav from '@/components/mainLanding/mainNav'

export default async function Page() {
  const t = await getTranslations('user')
  const user = await getUser()

  if (!user) {
    redirect(`/auth`)
  }

  const userInformation = await getUserProfile(user.id)

  if (!userInformation) {
    return <div>{t('userNotFound')}</div>
  }

  switch (user.role) {
    case Roles.USER:
    case Roles.ADMIN:
      return (
        <>
          <MainLandingNav
            user={{
              name: user?.name ?? '',
              picture: user?.picture ?? '',
              role: user.role || ''
            }}
          />
          <UserProfilePage user={userInformation} />
        </>
      )
    case Roles.NEW_USER:
      redirect(`/newuser`)
      break
    case Roles.ANDINO_ADMIN:
      redirect(`/andino-admin`)
      break
    default:
      redirect(`/auth`)
  }
}
