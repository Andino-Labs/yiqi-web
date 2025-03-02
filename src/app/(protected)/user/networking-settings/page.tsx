import NetworkingSettingsManager from '@/components/profile/NetworkingSettingsManager'
import { profileDataSchema } from '@/schemas/userSchema'
import { getUserOrRedirect } from '@/lib/auth/getUserOrRedirect'
import UserLayout from '@/components/user/UserLayout'

export default async function page() {
  const { user } = await getUserOrRedirect()

  const networkingData = {
    professionalMotivations: user.professionalMotivations,
    communicationStyle: user.communicationStyle,
    professionalValues: user.professionalValues,
    careerAspirations: user.careerAspirations,
    significantChallenge: user.significantChallenge,
    resumeUrl: user.resumeUrl,
    resumeFileName: user.resumeFileName,
    resumeText: user.resumeText
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <UserLayout userProps={profileDataSchema.parse(user)}>
        <NetworkingSettingsManager user={user} initialData={networkingData} />
      </UserLayout>
    </main>
  )
}
