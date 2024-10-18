/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

const logos = [
  '/bcp.svg',
  '/cc.jpeg',
  '/yape.png',
  '/forbis.png',
  '/bcp.svg',
  '/cc.jpeg',
  '/yape.png',
  '/forbis.png'
]

export interface TrustedByCarouselProps {
  title: string
}

export default function TrustedByCarousel(props: TrustedByCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const containerWidth = containerRef.current?.offsetWidth || 0
    const totalWidth = logos.length * 180 // Assuming each logo takes 180px width

    const intervalId = setInterval(() => {
      setScrollPosition(prevPosition => {
        const newPosition = prevPosition + 1
        return newPosition >= totalWidth ? 0 : newPosition
      })
    }, 50)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="w-full max-w-screen py-8 sm:py-12 max-h-[60vh] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-black text-center mb-6 sm:mb-8">
          {props.title}
        </h2>
        <div
          className="relative overflow-hidden h-16 sm:h-20"
          ref={containerRef}
        >
          <div
            className="absolute whitespace-nowrap"
            style={{
              transform: `translateX(-${scrollPosition}px)`,
              transition: 'transform 0.5s linear'
            }}
          >
            {[...logos, ...logos].map((logo, index) => (
              <div key={index} className="inline-block mx-4 sm:mx-8">
                <Image
                  src={logo}
                  alt={`Trusted company logo ${index + 1}`}
                  width={120}
                  height={60}
                  className="h-12 sm:h-16 w-auto object-contain"
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-white to-transparent z-10"></div>
        </div>
      </div>
    </div>
  )
}
