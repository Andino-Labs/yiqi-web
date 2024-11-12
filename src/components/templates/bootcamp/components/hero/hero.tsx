'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface ResponsiveVideoHero {
  videoSrc: string
  videoText: string
  title: string
  description: string
  ctaUrl1: string
  cta1: string
  ctaUrl2: string
  cta2: string
}
export interface ResponsiveVideoHeroProps {
  videoProps: ResponsiveVideoHero
}
export default function ResponsiveVideoHero(props: ResponsiveVideoHeroProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="relative w-full h-[80vh] overflow-hidden rounded-[22px] mt-14">
      {/* Video Background */}
      {isClient && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={props.videoProps.videoSrc} type="video/mp4" />
          {props.videoProps.videoText}
        </video>
      )}

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
          {props.videoProps.title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl">
          {props.videoProps.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={props.videoProps.ctaUrl1}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-black rounded-full font-semibold text-lg transition-colors duration-300 hover:bg-gray-200"
            >
              {props.videoProps.cta1}
            </motion.button>
          </Link>
          <Link href={props.videoProps.ctaUrl2}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-black rounded-full font-semibold text-lg transition-colors duration-300 hover:bg-gray-200"
            >
              {props.videoProps.cta2}
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  )
}
