"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { Section } from "../mainLayout";
import {
  Network,
  MessageSquare,
  Utensils,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

type FeatureText = {
  icon: JSX.Element;
  title: string;
  description: string;
  href?: string;
  cta?: string;
};

const featureText: FeatureText[] = [
  {
    icon: <Network className="h-8 w-8 text-orange-500" />,
    title: "Conexiones Clave",
    description:
      "Accede a una red de desarrolladores, fundadores de startups y líderes en innovación.",
    href: "#",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-orange-500" />,
    title: "Charlas Interactivas",
    description:
      "Aprende de expertos de la industria en sesiones prácticas y dinámicas.",
    href: "#",
  },
  {
    icon: <Utensils className="h-8 w-8 text-orange-500" />,
    title: "Networking con Sabor",
    description:
      "Disfruta de una parrillada y bebidas mientras te conectas con otros asistentes.",
    href: "#",
  },
];

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

const Feature = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Section
      id="conocemas"
      className="flex flex-col -mt-8 items-center justify-center min-h-screen"
    >
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
          <Balancer>¿Qué encontrarás en el TECH GRILL?</Balancer>
        </motion.h1>
        <motion.h3
          variants={itemVariants}
          className="text-2xl font-light text-orange-300 mb-8"
        >
          <Balancer>
            Una experiencia única que combina tecnología, networking y diversión
          </Balancer>
        </motion.h3>

        <motion.div
          variants={containerVariants}
          className="grid gap-6 md:grid-cols-3"
        >
          {featureText.map(({ icon, title, description, cta }, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="flex flex-col justify-between gap-6 rounded-lg border border-orange-500/30 bg-black/50 p-6 transition-all hover:shadow-lg hover:shadow-orange-500/20">
                <div className="grid gap-4">
                  <div className="bg-orange-500/20 rounded-full p-3 w-fit mx-auto">
                    {icon}
                  </div>
                  <h4 className="text-2xl font-bold text-orange-400">
                    {title}
                  </h4>
                  <p className="text-base text-orange-300">{description}</p>
                </div>
                {cta && (
                  <div className="flex h-fit items-center justify-center text-sm font-semibold text-orange-300 group">
                    <p>{cta}</p>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex justify-center mt-8"
        >
          <Link href="#payment">
            <motion.button
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-10 py-4 rounded-full font-bold text-xl flex items-center justify-center shadow-lg hover:shadow-orange-500/50 transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              Reserva tu lugar
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
};

export default Feature;
