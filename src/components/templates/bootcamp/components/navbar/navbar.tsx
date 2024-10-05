/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  HamburgerMenuIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  return (
    <>
      <div
        className={`
        fixed top-0 left-0 right-0 flex flex-col md:flex-row items-center justify-between 
        w-full max-w-[80vw] mx-auto border p-2 md:p-4 px-4 md:px-12 my-4 
        bg-white bg-opacity-40 backdrop-blur-lg shadow-lg hover:shadow-xl  z-50
        ${isMenuOpen ? "h-screen md:h-auto rounded-[22px] md:rounded-full" : "rounded-full"}
      `}
      >
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link href="/" className="flex items-center">
            <Image
              height={50}
              width={75}
              src="/logoandino.svg"
              alt="Logo"
              className="text-black"
              style={{ filter: "invert(1)" }}
            />
          </Link>
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <Cross1Icon className="w-6 h-6" />
            ) : (
              <HamburgerMenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        <div
          className={`
          ${isMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-6 
          text-lg font-mono mt-8 md:mt-0 w-full md:w-auto items-center
          ${isMenuOpen ? "h-full justify-center" : ""}
        `}
        >
          <Link
            href="#curricula"
            className="py-2 hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Curricula
          </Link>
          <Link
            href="#precio"
            className="py-2 hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Precio
          </Link>

          <Link
            href="https://youtu.be/es-E_6TAQrQ?si=x95Uck-wIdEvUzL1"
            className="py-2 hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Nosotros
          </Link>
          <Link
            href="#contacto"
            className="md:hidden mt-4 w-full max-w-xs"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="relative flex flex-row gap-2 items-center justify-center text-lg font-semibold group hover:bg-black hover:text-white text-black border border-black p-2 px-4 rounded-full transition-colors duration-300">
              Registrate
              <ArrowRightIcon className="w-4 h-4 group-hover:-rotate-45 transition-all" />
            </div>
          </Link>
        </div>

        <Link href="#contacto" className="hidden md:block">
          <div className="relative flex flex-row gap-2 items-center justify-center text-lg font-semibold group hover:bg-black hover:text-white text-black border border-black p-2 px-4 rounded-full transition-colors duration-300">
            Registrate
            <ArrowRightIcon className="w-4 h-4 group-hover:-rotate-45 transition-all" />
          </div>
        </Link>
      </div>
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
