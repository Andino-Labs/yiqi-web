"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../mainLayout";
import { ChevronRight, PlayCircle } from "lucide-react";
import Balancer from "react-wrap-balancer";
import Link from "next/link";

export default function Evento() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isHovered, setIsHovered] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Section className="flex flex-col -mt-8 items-center justify-center min-h-screen">
      <motion.div
        className="p-8 flex flex-col text-center w-full backdrop-blur-md bg-black bg-opacity-60 rounded-[30px] border border-orange-500/30 shadow-2xl shadow-orange-500/20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-orange-500 text-4xl md:text-5xl font-bold mb-6"
        >
          ¿Qué es el TECH GRILL?
        </motion.h1>
        <motion.div
          variants={itemVariants}
          className="relative aspect-video w-full mb-6 flex-grow"
        >
          <video
            ref={videoRef}
            className="w-full h-full rounded-lg object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src="/2.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
          <AnimatePresence>
            {!isPlaying && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={togglePlay}
                className="absolute inset-0 flex items-center -mb-8 justify-center bg-black bg-opacity-50 hover:bg-opacity-30 transition-all duration-300"
              >
                <PlayCircle className="w-20 h-20 text-orange-500 opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="mt-4 flex flex-col items-center justify-center"
        >
          <p className="mt-2 text-orange-300 text-base md:text-lg lg:text-xl max-w-2xl mx-auto p-2">
            <Balancer>
              ¡Descubre TECH GRILL! Este evento único combina aprendizaje,
              diversión y networking en un ambiente relajado. Disfruta de una
              deliciosa parrillada y vino mientras interactúas con personas
              influyentes y aprendes de expertos en innovación y tecnologías
              emergentes. ¡Una experiencia imperdible!
            </Balancer>
          </p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex justify-center">
          <Link href="#payment">
            <motion.button
              className="mt-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-10 py-4 rounded-full font-bold text-xl flex items-center justify-center shadow-lg hover:shadow-orange-500/50 transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              Comprar Entrada
              <motion.div
                className="ml-2"
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.div>
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </Section>
  );
}
