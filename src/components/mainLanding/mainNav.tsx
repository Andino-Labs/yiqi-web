'use client'

import { useState, useEffect } from 'react'
import { MoveUpRight, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

interface User {
  name?: string
  picture?: string
}

interface HeaderProps {
  user: User | null
}

export default function MainLandingNav({ user }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-black/80 shadow-md' : 'bg-transparent'
      } backdrop-blur-xl`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={'/'} className="flex-shrink-0">
            <div
              className="flex items-center space-x-3 text-xl font-extrabold text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #6de4e8, rgba(0, 178, 218, 0.6) 95.83%)'
              }}
            >
              <span className="rounded-full bg-cyan-500 p-2 text-white">
                🚀
              </span>
              <span>Yiqi</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            <NavLink href="#events">Explore Events</NavLink>
            {!user ? (
              <Link href={'/user'}>
                <Button size="sm" variant="default" className="font-semibold">
                  Log in
                </Button>
              </Link>
            ) : (
              <Link href={'/admin'}>
                <Avatar className="w-8 h-8">
                  <AvatarImage alt={user.name ?? ''} src={user.picture ?? ''} />
                  <AvatarFallback>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col space-y-4">
                <NavLink href="/events" mobile>
                  Explore Events
                </NavLink>
                {!user ? (
                  <Link href={'/user'}>
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full font-semibold"
                    >
                      Log in
                    </Button>
                  </Link>
                ) : (
                  <Link href={'/admin'} className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        alt={user.name ?? ''}
                        src={user.picture ?? ''}
                      />
                      <AvatarFallback>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span>My Account</span>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function NavLink({
  href,
  children,
  mobile = false
}: {
  href: string
  children: React.ReactNode
  mobile?: boolean
}) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        size={mobile ? 'default' : 'sm'}
        className={`font-semibold text-sm space-x-1 ${mobile ? 'w-full justify-start' : ''}`}
      >
        <span>{children}</span>
        <MoveUpRight size={16} />
      </Button>
    </Link>
  )
}
