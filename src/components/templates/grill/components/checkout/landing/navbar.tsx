'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

interface GrillNavValues {
  href: string
  label: string
}

export interface GrillNavbarProps {
  navItems: GrillNavValues[]
  cta: string
}

export default function Navbar(props: GrillNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navItems = props.navItems

  return (
    <div className="px-4 sm:px-6 lg:px-8 flex justify-center w-full">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed w-full md:max-w-[64%] px-4 max-w-[87%] top-0 z-50 flex flex-row items-center justify-between mt-4 bg-black/30 p-2 backdrop-blur-xl rounded-[22px] border border-orange-500/30 shadow-lg shadow-orange-500/20"
      >
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            height={100}
            width={100}
            className="mr-2 p-2"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-orange-300 hover:text-orange-500 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link href="#payment">
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300">
              {props.cta}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-orange-500" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-black/30 backdrop-blur-xl mt-2 p-4 rounded-[22px] border border-orange-500/30 shadow-lg md:hidden"
            >
              <nav className="flex flex-col space-y-4">
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-orange-300 hover:text-orange-500 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="#payment">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300">
                    {props.cta}
                  </Button>
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
