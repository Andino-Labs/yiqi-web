'use client'

import { YouTubeEmbed } from '@next/third-parties/google'
import Slider from 'react-slick'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

// Import slick styles
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// Define the props for our component
interface YouTubeCarouselProps {
  videos: { id: string; title: string }[]
}

export default function YouTubeCarousel({ videos }: YouTubeCarouselProps) {
  const [sliderRef, setSliderRef] = useState<Slider | null>(null)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }

  return (
    <section
      className="w-full min-h-screen flex flex-col justify-center"
      id="nosotros"
    >
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 lg:py-32">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Nuestros Eventos y Testimonios
        </h2>
        <div className="relative max-w-4xl mx-auto flex flex-col items-center justify-center">
          <Slider
            ref={slider => setSliderRef(slider)}
            {...settings}
            className="w-full flex flex-col items-center justify-center"
          >
            {videos.map(video => (
              <div
                key={video.id}
                className="flex flex-col justify-center items-center px-2"
              >
                <div className="ml-0 md:ml-20 aspect-w-16 aspect-h-9 w-full max-w-[700px] rounded-xl overflow-hidden shadow-2xl">
                  <YouTubeEmbed videoid={video.id} params="controls=1" />
                </div>
                <h3 className="text-2xl font-semibold mt-6 text-center text-gray-700">
                  {video.title}
                </h3>
              </div>
            ))}
          </Slider>
          {videos.length > 1 && (
            <>
              <button
                onClick={() => sliderRef?.slickPrev()}
                className="absolute top-1/2 -left-12 -translate-y-1/2 bg-white rounded-full p-3 shadow-md z-10 transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 md:block hidden"
                aria-label="Previous video"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={() => sliderRef?.slickNext()}
                className="absolute top-1/2 -right-12 -translate-y-1/2 bg-white rounded-full p-3 shadow-md z-10 transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 md:block hidden"
                aria-label="Next video"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
