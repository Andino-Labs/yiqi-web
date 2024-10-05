"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ResponsiveVideoHero() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
          <source src="/e.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
          Impulsa tu carrera en inteligencia artificial
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl">
          Unete al futuro de la industria tecnologica con este bootcamp hecho
          por expertos de la industria
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="#contacto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-black rounded-full font-semibold text-lg transition-colors duration-300 hover:bg-gray-200"
            >
              Quiero empezar!
            </motion.button>
          </Link>
          <Link href="#curricula">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-black rounded-full font-semibold text-lg transition-colors duration-300 hover:bg-gray-200"
            >
              Quiero saber más
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}
