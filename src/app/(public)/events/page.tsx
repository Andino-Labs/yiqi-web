import Footer from '@/components/mainLanding/Footer'
import MainLandingNav from '@/components/mainLanding/mainNav'
import EventsContainer from '@/components/EventsContainer'
import { getUser } from '@/lib/auth/lucia'

export default async function Page() {
  const user = await getUser()

  return (
    <>
      <div className="fixed inset-0 h-screen w-screen -z-10 bg-black"></div>
      <MainLandingNav user={user!} />
      <EventsContainer />
      <Footer />
    </>
  )
}
