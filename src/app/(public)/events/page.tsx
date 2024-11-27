import Footer from '@/components/mainLanding/Footer'
import MainLandingNav from '@/components/mainLanding/mainNav'
import EventsContainer from '@/components/EventsContainer'
import { getUser } from '@/lib/auth/lucia'
import { logOut } from '@/services/auth/auth'

export default async function Page() {
  const user = await getUser()

  return (
    <>
      <div className="fixed inset-0 h-screen w-screen -z-10 bg-black"></div>
      <MainLandingNav
        user={{ name: user?.name, picture: user?.picture as string }}
        logOut={logOut}
      />
      <EventsContainer />
      <Footer />
    </>
  )
}
