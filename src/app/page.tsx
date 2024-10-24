import CommunityHighlights from '@/components/CommunityHighlights'
import Features from '@/components/Features'
import Hero from '@/components/hero'
import UpcomingEvents from '@/components/UpcomingEvents'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />
      {/* Features Section */}
      <div className="lg:max-w-[80%] max-w-[90%] mx-auto">
        <Features />
        {/* Community Highlights */}
        <CommunityHighlights />
        {/* Upcoming Events Section */}
        <UpcomingEvents />
      </div>
    </>
  )
}
