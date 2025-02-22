import CommunitiesList from '@/components/communities/CommunitiesList'
import Footer from '@/components/mainLanding/Footer'
import MainLandingNav from '@/components/mainLanding/mainNav'
import { getUser } from '@/lib/auth/lucia'
import getCommunities from '@/services/actions/communities/getCommunities'

export default async function communities() {
  const { communities } = await getCommunities()
  const user = await getUser()

  return (
    <>
      <MainLandingNav user={user!} />
      <CommunitiesList communities={communities} />
      <Footer />
    </>
  )
}
