import CommunitiesList from '@/components/communities/CommunitiesList'
import { organizationService } from '@/services/organizationService'

export default async function communities() {
  
  const organizations = await organizationService.getAll()

  return (
    <>
      <CommunitiesList communities={organizations}/>
    </>
  )
}
