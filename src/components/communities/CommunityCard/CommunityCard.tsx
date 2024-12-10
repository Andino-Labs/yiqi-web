import Image from 'next/image'
import Link from 'next/link'
import { PublicCommunityType } from '@/schemas/communitySchema'
import { useTranslations } from 'next-intl'

interface CommunityCardProps {
  community: PublicCommunityType
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  const { id, name, description, logo } = community
  const t = useTranslations('Community')

  return (
    <Link href={`/communities/${id}`}>
      <div className="group relative bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 min-h-[300px]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />
        <div className="absolute inset-[1px] bg-gray-900 rounded-xl -z-5" />

        <div className="relative h-48 w-full">
          {logo ? (
            <Image src={logo} alt={name} fill className="object-cover" />
          ) : (
            <div className="h-full w-full bg-gray-700 flex items-center justify-center">
              <span className="text-white text-sm">{t('noLogoAvailable')}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
        </div>

        <div className="p-6 relative flex flex-col justify-between min-h-[150px]">
          <div>
            <p className="text-gray-400 text-sm line-clamp-2 mb-4">
              {description || t('noDescriptionAvailable')}
            </p>
          </div>

          <div className="flex items-center justify-center pt-4 border-t border-gray-800">
            <span className="text-sm text-gray-300">
              {name || t('noNameAvailable')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CommunityCard
