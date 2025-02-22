import MainLandingNav from '@/components/mainLanding/mainNav'
import { MatchesList } from './_temp/tempcomp'
import { getNetworkingMatchesByEventUser } from '@/services/actions/networking/getNetworkingMatchesByEventUser'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getUserOrRedirect } from '@/lib/auth/getUserOrRedirect'

export const dynamic = 'force-dynamic'

export default async function Page({
  params
}: {
  params: { eventId: string }
}) {
  const t = await getTranslations('Networking')
  const { user } = await getUserOrRedirect()

  const { matches, errors } = await getNetworkingMatchesByEventUser(
    user.id,
    params.eventId
  )

  // Common layout elements
  const Layout = ({ children }: { children: React.ReactNode }) => (
    <>
      <div className="fixed inset-0 h-screen w-screen -z-10 bg-black"></div>
      <MainLandingNav user={user!} />
      <div className="lg:max-w-[80%] max-w-[90%] mx-auto pt-20">{children}</div>
    </>
  )

  // Handle error states
  if (!errors.registeredForEvent) {
    return (
      <Layout>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">{t('notRegistered')}</h2>
          <p className="text-gray-400">{t('registerFirst')}</p>
          <Button variant="outline" asChild>
            <Link href={`/${params.eventId}`}>{t('registerEvent')}</Link>
          </Button>
        </div>
      </Layout>
    )
  }

  if (!errors.missingProfile) {
    return (
      <Layout>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">{t('needMoreInfo')}</h2>
          <p className="text-gray-400">{t('completeProfile')}</p>
          <Button variant="outline" asChild>
            <Link href="/user/networking-settings">
              {t('completeProfileButton')}
            </Link>
          </Button>
        </div>
      </Layout>
    )
  }

  // Handle job status states
  if (errors.matchesJobStatus) {
    switch (errors.matchesJobStatus) {
      case 'PENDING':
      case 'PROCESSING':
        return (
          <Layout>
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
              <h2 className="text-2xl font-semibold">
                {t('generatingMatches')}
              </h2>
              <p className="text-gray-400">{t('processingTime')}</p>
            </div>
          </Layout>
        )
      case 'FAILED':
        return (
          <Layout>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">
                {t('matchGenerationFailed')}
              </h2>
              <p className="text-gray-400">{t('contactOrganizer')}</p>
            </div>
          </Layout>
        )
      case null:
        return (
          <Layout>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">
                {t('matchProcessNotFound')}
              </h2>
              <p className="text-gray-400">{t('contactOrganizerCheck')}</p>
            </div>
          </Layout>
        )
    }
  }

  // Show matches if everything is OK
  return (
    <Layout>
      {matches.length > 0 ? (
        <MatchesList matches={matches} />
      ) : (
        <p className="text-xl">{t('noMatches')}</p>
      )}
    </Layout>
  )
}
