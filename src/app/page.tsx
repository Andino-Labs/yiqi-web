import CommunityHighlights from '@/components/mainLanding/CommunityHighlights'
import Features from '@/components/mainLanding/Features'
import Footer from '@/components/mainLanding/Footer'
import Hero from '@/components/mainLanding/hero'
import MainLandingNav from '@/components/mainLanding/mainNav'
import UpcomingEvents from '@/components/mainLanding/UpcomingEvents'
import { eventListItem } from '@/data/events'
import { getUser } from '@/lib/auth/lucia'

export default async function Home() {
  const user = await getUser()
  return (
    <>
      <div className="fixed inset-0 h-screen w-screen -z-10 bg-black"></div>
      <MainLandingNav
        user={{ name: user?.name, picture: user?.picture as string }}
      />
      {/* Hero Section */}
      <Hero />
      {/* Features Section */}
      <div className="lg:max-w-[80%] max-w-[90%] mx-auto">
        <Features />
        {/* Community Highlights */}
        <CommunityHighlights />
        {/* Upcoming Events Section */}
        <UpcomingEvents events={eventListItem} />
      </div>
      <Footer />
    </>
  )
}
