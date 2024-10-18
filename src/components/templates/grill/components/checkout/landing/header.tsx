"use client";

import { motion } from "framer-motion";
import Balancer from "react-wrap-balancer";
import { Section, Container } from "../mainLayout";
import Link from "next/link";
import { ContactForm } from "./contact-form";
import { Button } from "@/components/ui/button";
const containerVariants = {
  hidden: { opacity: 0, y: -50 },
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

export interface GrillHeaderProps {
  headerTitle: string;
  headerTitleSecondary: string;
  headerDescription: string;
  cta: string;
}

export default function Header(props: GrillHeaderProps) {
  return (
    <Section
      id="payment"
      className="flex z-10 flex-col items-center justify-center"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <Container className="flex flex-col lg:flex-row items-start justify-between h-full w-full backdrop-blur-md bg-black bg-opacity-60 rounded-[30px] border border-orange-500/30 shadow-2xl shadow-orange-500/20 p-8 gap-8">
          <div className="flex flex-col text-left w-full lg:w-1/2">
            <motion.h1
              variants={itemVariants}
              className="!mb-4 text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500"
            >
              {props.headerTitle}{" "}
              <span className="text-white">{props.headerTitleSecondary}</span>
            </motion.h1>
            <motion.h3
              variants={itemVariants}
              className="text-orange-300 text-lg md:text-xl lg:text-2xl mb-8"
            >
              <Balancer>{props.headerDescription}</Balancer>
            </motion.h3>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mb-8"
            >
              <Link href="#conocemas" className="w-full sm:w-1/2">
                <Button className="min-w-full rounded-[50px] sm:w-1/2  border  border-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 text-lg py-6">
                  {props.cta}
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="w-full lg:w-1/2">
            <ContactForm />
          </motion.div>
        </Container>
      </motion.div>
    </Section>
  );
}
