'use client'

import { useState, useEffect } from 'react'
import { Menu, TicketSlash, Users } from 'lucide-react'
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
import { AccountDropdown } from '../AccountDropdown'
import { translations } from '@/lib/translations/translations'
import Image from 'next/image'

interface User {
  name?: string
  picture?: string
  email?: string
}

interface HeaderProps {
  user: User | null
  logOut: () => void
}

export default function MainLandingNav({ user, logOut }: HeaderProps) {
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
        isScrolled
          ? 'dark:bg-black/80 shadow-md backdrop-blur-lg'
          : 'bg-transparent'
      } backdrop-blur-xl`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={'/'} className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              height={100}
              width={100}
              className="mr-2 p-2"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            <NavLink href="/events">
              <TicketSlash size={16} />
              <span>{translations.es.events}</span>
            </NavLink>
            <NavLink href="/communities">
              <Users size={16} />
              <span>{translations.es.communities}</span>
            </NavLink>
            {!user || Object.keys(user).length === 0 ? (
              <Link href={'/user'}>
                <Button size="sm" variant="default" className="font-semibold">
                  {translations.es.login}
                </Button>
              </Link>
            ) : (
              <AccountDropdown user={user} signOut={logOut} />
            )}
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-transparent"
              >
                <Menu className="h-6 w-6 text-white " />
                <span className="sr-only">{translations.es.openMenu}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>{translations.es.menu}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col space-y-4">
                <NavLink href="/communities" mobile>
                  {translations.es.communities}
                </NavLink>
                <NavLink href="/events" mobile>
                  {translations.es.events}
                </NavLink>
                {!user ? (
                  <Link href={'/user'}>
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full font-semibold"
                    >
                      {translations.es.login}
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
                    <span>{translations.es.myAccount}</span>
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
        className={` text-[hsla(0,0%,100%,.79)] hover:text-white hover:bg-transparent text-sm font-medium space-x-0 ${mobile ? 'w-full justify-start' : ''}`}
      >
        {children}
      </Button>
    </Link>
  )
}
