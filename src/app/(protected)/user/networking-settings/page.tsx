import NetworkingProfileForm from '@/components/profile/NetworkingProfileForm'
import UserLayout from '@/components/user/UserLayout'
import { profileDataSchema } from '@/schemas/userSchema'
import { getUserOrRedirect } from '@/lib/auth/getUserOrRedirect'

export default async function page() {
  const { userCurrent, user } = await getUserOrRedirect()

  const networkingData = {
    professionalMotivations: user.professionalMotivations,
    communicationStyle: user.communicationStyle,
    professionalValues: user.professionalValues,
    careerAspirations: user.careerAspirations,
    significantChallenge: user.significantChallenge,
    resumeUrl: user.resumeUrl,
    resumeFileName: user.resumeFileName
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
