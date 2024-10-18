'use client'

import { useState, useEffect } from "react";
import { ContactForm } from "./contact-form";
interface header {
  header1: string;
  header2: string;
}
export interface ContactProps {
  videoSrc: string;
  videoText: string;
  header: header[];
}

export default function ContactSection(props: ContactProps) {
  const [isClient, setIsClient] = useState(false);
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
          <source src={props.videoSrc || "/c.mp4"} type="video/mp4" />
          {props.videoText}
        </video>
      )}

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex md:flex-row flex-col gap-12 items-center justify-center text-white p-4">
        {/* {props.header.header1} <br /> {props.header.header2} */}
        {props.header.map((items, index) => (
          <h1 key={index}>
            {items.header1} <br /> {items.header2}
          </h1>
        ))}
        <ContactForm />
      </div>
    </div>
  )
}
