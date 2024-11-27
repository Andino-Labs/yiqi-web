'use client'

import { Button } from '@/components/ui/button'
import { translations } from '@/lib/translations/translations'
import { motion } from 'framer-motion'
import { Calendar, Sparkles, Users } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <div className="bg-black relative overflow-hidden mt-10">
      <div className="relative max-w-7xl mx-auto pt-20 pb-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#04F1FF]/10 to-[#6de4e8]/10 border border-[#04F1FF]/20">
              <Sparkles className="w-4 h-4 mr-2 text-[#04F1FF]" />
              <span className="text-sm text-[#04F1FF]">
                {translations.es.heroSubtitle}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-white">{translations.es.heroTitle1}</span>
              <br />
              <span className="bg-gradient-to-r from-[#04F1FF] to-[#6de4e8] text-transparent bg-clip-text">
                {translations.es.heroTitle2}
              </span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg max-w-xl">
              {translations.es.heroDescription}
            </p>
            <Link href={'/admin/organizations'} className="block">
              <Button
                size="lg"
                className="font-bold bg-gradient-to-r from-[#04F1FF] to-[#6de4e8] text-black hover:opacity-90 transition-opacity w-[40%] sm:w-auto"
              >
                <span className="text-[12px] md:text-base text-gray-800">
                  {translations.es.heroCTA}
                </span>
              </Button>
            </Link>
          </motion.div>

          {/* Right Column - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Feature Cards */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-black to-[#04F1FF]/10 border border-[#04F1FF]/20"
            >
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-[#04F1FF] mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                {translations.es.feature1Title}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                {translations.es.feature1Description}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-black to-[#6de4e8]/10 border border-[#6de4e8]/20"
            >
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-[#6de4e8] mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                {translations.es.feature2Title}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                {translations.es.feature2Description}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
