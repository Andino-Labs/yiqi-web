import { PublicCommunityType } from '@/schemas/communitySchema'
import Image from 'next/image'
import Link from 'next/link'
import { translations } from '@/lib/translations/translations'

interface CommunityCardProps {
  community: PublicCommunityType
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  const { id, name, description, logo } = community

  return (
    <Link href={`/communities/${id}`}>
      <div className="group relative bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />
        <div className="absolute inset-[1px] bg-gray-900 rounded-xl -z-5" />

        <div className="relative h-48 w-full">
          {logo ? (
            <Image src={logo} alt={name} fill className="object-cover" />
          ) : (
            <div className="h-full w-full bg-gray-700 flex items-center justify-center">
              <span className="text-white text-sm">
                {translations.es.communitiesPage.noLogoAvailable}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
        </div>

        <div className="p-6 relative">
          <div className="mb-4">
            <p className="text-gray-400 text-sm line-clamp-2 mb-4">
              {description}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">{name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CommunityCard
