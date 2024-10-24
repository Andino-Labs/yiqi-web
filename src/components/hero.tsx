'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Calendar, Sparkles, Users } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <div className=" bg-black relative overflow-hidden">
      {/* Gradient Orbs */}
      {/* <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#04F1FF] rounded-full filter blur-[128px] opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#6de4e8] rounded-full filter blur-[128px] opacity-20 translate-x-1/2" /> */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
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
                The Future of Events
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-white">Create Unforgettable</span>
              <br />
              <span className="bg-gradient-to-r from-[#04F1FF] to-[#6de4e8] text-transparent bg-clip-text">
                Experiences
              </span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg max-w-xl">
              Connect, celebrate, and create memories. Our platform makes it
              easy to discover and organize events that bring people together.
            </p>
            <Link href={'/admin/organizations'}></Link>
            <Button
              size="lg"
              className="font-bold  bg-gradient-to-r from-[#04F1FF] to-[#6de4e8] text-black hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              Create your first event
            </Button>
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
                Smart Scheduling
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                AI-powered event scheduling that adapts to your preferences and
                availability.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-black to-[#6de4e8]/10 border border-[#6de4e8]/20"
            >
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-[#6de4e8] mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                Community Driven
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Connect with like-minded people and build lasting relationships.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
