import CommunityCard from './CommunityCard/CommunityCard'
import { PublicCommunityType } from '@/schemas/communitySchema'

type CommunitiesListProps = {
  communities: PublicCommunityType[]
  showHeader?: boolean
}

const CommunitiesList = ({
  communities,
  showHeader = true
}: CommunitiesListProps) => {
  const hasCommunities = communities.length > 0

  return (
    <section id="communities" className="w-full bg-black min-h-screen pt-9">
      <div className="w-full py-10">
        <div className="max-w-7xl mx-auto px-4">
          {showHeader && (
            <div className="mb-8 pb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Communities
              </h2>
              <div className="mt-2 h-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            </div>
          )}

          {hasCommunities ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {communities.map(community => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-16">
              <p>No communities found at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CommunitiesList
