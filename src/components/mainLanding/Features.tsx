import { Card, CardContent } from '@/components/ui/card'
import { features } from '@/data/events'
import { translations } from '@/lib/translations/translations'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

export default function Features() {
  return (
    <section className="w-full py-12 bg-black/95">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              {translations.es.featuresTitle}
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed">
              {translations.es.featuresDescription}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/80 transition-all duration-300"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardContent className="p-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-gray-800/50 group-hover:bg-gray-800 transition-colors">
                    <feature.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-4 text-gray-400 text-sm">
                  {feature.description}
                </p>
              </CardContent>

              {/* Bottom gradient line */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/0 via-purple-500/20 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">{translations.es.featuresCTA}</p>
          <div className="inline-flex items-center justify-center rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <Link
              href={'https://github.com/Andino-Labs/yiqi-mobile'}
              className="flex gap-2 items-center justify-center"
            >
              <GitHubLogoIcon />
              {translations.es.featuresViewOnGitHub}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
