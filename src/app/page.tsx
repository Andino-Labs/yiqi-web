import CommunityHighlights from '@/components/mainLanding/CommunityHighlights'
import Features from '@/components/mainLanding/Features'
import Footer from '@/components/mainLanding/Footer'
import Hero from '@/components/mainLanding/hero'
import MainLandingNav from '@/components/mainLanding/mainNav'
import PublicEventsList from '@/components/events/PublicEventsList'
import { getUser } from '@/lib/auth/lucia'
import { getPublicEvents } from '@/services/actions/event/getPublicEvents'
import { logOut } from '@/services/auth/auth'

export default async function Home() {
  const user = await getUser()
  const { events } = await getPublicEvents({ limit: 8 })

  return (
    <>
      <div className="fixed inset-0 h-screen w-screen -z-10 bg-black"></div>
      <MainLandingNav
        user={{ name: user?.name, picture: user?.picture as string }}
        logOut={logOut}
      />

      <div className="lg:max-w-[80%] max-w-[90%] mx-auto">
        <Hero />
        <Features />
        <CommunityHighlights />
        <PublicEventsList events={events} />
      </div>
      <Footer />
    </>
  )
}
