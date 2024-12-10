import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PublicCommunityType } from '@/schemas/communitySchema'
import { useTranslations } from 'next-intl'

const CommunityHighlights = ({
  communities
}: {
  communities: PublicCommunityType[]
}) => {
  const t = useTranslations('CommunityHighlights')

  return (
    <section className="w-full bg-black py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">
            {t('highlightsTitle')}
          </h2>
          <p className="mt-2 text-gray-400">{t('highlightsSubtitle')}</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[1fr]">
          {communities.map(community => (
            <Link href={`/communities/${community.id}`} key={community.id}>
              <div className="group relative bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 flex flex-col h-full">
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-3">
                    <div className="relative w-12 h-12">
                      <Image
                        src={community.logo || ''}
                        alt={community.name}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between flex-grow">
                    <h3 className="text-lg font-semibold text-white mb-1 flex items-center justify-between gap-2 group-hover:text-blue-400 transition-colors">
                      <span className="block text-ellipsis overflow-hidden whitespace-nowrap line-clamp-1">
                        {community.name}
                      </span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2 overflow-hidden">
                      {community.description || t('noDescriptionAvailable')}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CommunityHighlights
