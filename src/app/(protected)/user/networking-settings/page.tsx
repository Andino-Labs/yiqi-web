import NetworkingProfileForm from '@/components/profile/NetworkingProfileForm'
import UserLayout from '@/components/user/UserLayout'
import { getUser } from '@/lib/auth/lucia'
import { profileDataSchema } from '@/schemas/userSchema'
import { getUserProfile } from '@/services/actions/userActions'
import { redirect } from 'next/navigation'

export default async function page() {
  const userCurrent = await getUser()

  if (!userCurrent) {
    redirect('/auth')
  }

  const user = await getUserProfile(userCurrent.id)

  const networkingData = {
    professionalMotivations: user?.professionalMotivations,
    communicationStyle: user?.communicationStyle,
    professionalValues: user?.professionalValues,
    careerAspirations: user?.careerAspirations,
    significantChallenge: user?.significantChallenge
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
