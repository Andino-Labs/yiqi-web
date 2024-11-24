import CommunitiesList from '@/components/communities/CommunitiesList'
import Footer from '@/components/mainLanding/Footer'
import MainLandingNav from '@/components/mainLanding/mainNav'
import { getUser } from '@/lib/auth/lucia'
import { getCommunities } from '@/services/actions/communities/getCommunities'
import { logOut } from '@/services/auth/auth'

export default async function communities() {
  const organizations = await getCommunities()
  const user = await getUser()

  return (
    <>
      <MainLandingNav
        user={{ name: user?.name, picture: user?.picture as string }}
        logOut={logOut}
      />
      <CommunitiesList communities={organizations} />
      <Footer />
    </>
  )
}