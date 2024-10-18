'use client'

import { useState, useEffect } from 'react'
import { ContactForm } from './contact-form'

export default function ContactSection() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div
      id="contacto"
      className="relative w-full md:min-h-[80vh] min-h-[700px] h-full overflow-hidden rounded-[22px] mt-14"
    >
      {/* Video Background */}
      {isClient && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/c.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex md:flex-row flex-col gap-12 items-center justify-center text-white p-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-start">
          Postula a nuestro <br /> bootcamp
        </h1>
        <ContactForm />
      </div>
    </div>
  )
}
