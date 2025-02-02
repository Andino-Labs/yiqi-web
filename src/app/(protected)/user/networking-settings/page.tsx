import NetworkingProfileForm from '@/components/profile/NetworkingProfileForm'
import UserLayout from '@/components/user/UserLayout'
import { getUser } from '@/lib/auth/lucia'
import { profileDataSchema } from '@/schemas/userSchema'
import { getUserProfile } from '@/services/actions/userActions'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export default async function page() {
  const userCurrent = await getUser()
  const t = await getTranslations('user')

  if (!userCurrent?.id) {
    return <div>{t('notFound')}</div>
  }

  const user = await getUserProfile(userCurrent.id)

  if (!user) {
    return <div>{t('notFound')}</div>
  }

  // Extract networking specific data
  const networkingData = {
    professionalMotivations: user.professionalMotivations,
    communicationStyle: user.communicationStyle,
    professionalValues: user.professionalValues,
    careerAspirations: user.careerAspirations,
    significantChallenge: user.significantChallenge
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <UserLayout userProps={profileDataSchema.parse(user)}>
        <NetworkingProfileForm
          userId={userCurrent.id}
          initialData={networkingData}
        />
      </UserLayout>
    </main>
  )
}
