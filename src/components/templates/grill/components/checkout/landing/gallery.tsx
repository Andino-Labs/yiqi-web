"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Section, Container } from "../mainLayout";

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
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export interface GrillGalleryProps {
  header1: string;
  images: string[];
}

export default function ImageGallery(props: GrillGalleryProps) {
  return (
    <Section className="flex z-10 flex-col items-center justify-center py-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <Container className="backdrop-blur-md bg-black bg-opacity-60 rounded-[30px] border border-orange-500/30 shadow-2xl shadow-orange-500/20 p-8">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-orange-500 mb-8 text-center"
          >
            {props.header1}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* static generated image src mapping */}
            {props.images.map((src, index) => (
              <motion.div
                key={src}
                variants={itemVariants}
                className="relative aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  src={src}
                  alt={`Event image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 hover:scale-110"
                />
              </motion.div>
            ))}
          </div>
        </Container>
      </motion.div>
    </Section>
  );
}
