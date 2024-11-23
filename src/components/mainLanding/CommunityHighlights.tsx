import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { communityHighlights } from '@/data/events'
import { translations } from '@/lib/translations/translations'

const CommunityHighlights = () => {
  return (
    <section className="w-full bg-black py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">
            {translations.es.highlightsTitle}
          </h2>
          <p className="mt-2 text-gray-400">
            {translations.es.highlightsSubtitle}
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {communityHighlights.map(community => (
            <div
              key={community.id}
              className="group relative bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300"
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="relative w-12 h-12">
                    <Image
                      src={community.logo}
                      alt={community.name}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                </div>

                <Link href={community.link} className="block">
                  <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                    {community.name}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>

                  <p className="text-sm text-gray-400 line-clamp-2">
                    {community.description}
                  </p>
                </Link>

                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/0 via-purple-500/20 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CommunityHighlights
