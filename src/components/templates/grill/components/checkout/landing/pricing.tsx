"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../mainLayout";
import {
  Skull,
  Clock,
  MapPin,
  Ticket,
  ChevronRight,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

export default function PrecioEvento() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setHasInteracted(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("play", () => setIsPlaying(true));
      video.addEventListener("pause", () => setIsPlaying(false));
      return () => {
        video.removeEventListener("play", () => setIsPlaying(true));
        video.removeEventListener("pause", () => setIsPlaying(false));
      };
    }
  }, []);

  return (
    <Section
      id="entrada"
      className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        className="w-full max-w-4xl backdrop-blur-md bg-black bg-opacity-60 rounded-[30px] border border-orange-500/30 shadow-2xl shadow-orange-500/20 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6 md:p-8">
            <motion.h2
              variants={itemVariants}
              className="text-orange-500 text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            >
              Tech Grill: Edición Halloween
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="text-5xl sm:text-6xl font-bold text-white mb-6"
            >
              S/. 65
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center space-y-4 mb-8"
            >
              <div className="flex items-center text-orange-300 text-sm sm:text-base">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-orange-500" />
                <span>Sábado 2 de Noviembre, 7:00 PM - 10:00 PM</span>
              </div>
              <div className="flex items-center text-orange-300 text-sm sm:text-base">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-orange-500" />
                <span>Los Laureles 104, Santiago de Surco 15023</span>
              </div>
            </motion.div>

            <motion.ul
              variants={itemVariants}
              className="flex flex-col items-center justify-center text-white text-left space-y-4 mb-8"
            >
              {[
                "Acceso exclusivo al evento y charlas",
                "Networking con líderes e innovadores de la industria tech",
                "Dinamicas de networking efectivo y divertido",
                "Parrillada y bebidas incluidas durante todo el evento",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start text-sm sm:text-base"
                  whileHover={{ scale: 1.05, color: "#f97316" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {index % 2 === 0 ? (
                    <Skull className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-orange-500 flex-shrink-0 mt-1" />
                  ) : (
                    <Ticket className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-orange-500 flex-shrink-0 mt-1" />
                  )}
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={itemVariants} className="flex justify-center">
              <Link href="#payment">
                <motion.button
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-lg sm:text-xl flex items-center justify-center shadow-lg hover:shadow-orange-500/50 transition-shadow duration-300"
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
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>
          </div>
          <motion.div
            variants={itemVariants}
            className="flex-1 relative aspect-[9/16] md:aspect-auto md:h-auto"
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              preload="metadata"
            >
              <source src="/output.mp4" type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
            <AnimatePresence>
              {(!isPlaying || !hasInteracted) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-30 transition-all duration-300"
                >
                  <PlayCircle className="w-16 h-16 sm:w-20 sm:h-20 text-orange-500 opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        <motion.div
          variants={itemVariants}
          className="p-6 md:p-8 flex flex-col items-center justify-center"
        >
          <p className="text-orange-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            <Balancer>
              ¡Descubre TECH GRILL! Este evento único combina aprendizaje,
              diversión y networking en un ambiente relajado. Disfruta de una
              deliciosa parrillada y vino mientras interactúas con personas
              influyentes y aprendes de expertos en innovación y tecnologías
              emergentes. ¡Una experiencia imperdible!
            </Balancer>
          </p>
        </motion.div>
      </motion.div>
    </Section>
  );
}
