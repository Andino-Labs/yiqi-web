'use client'

import { useState, useEffect } from 'react'
import { Menu, TicketSlash, Users, LogOut } from 'lucide-react'
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
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import LangSelector from '../languageSelector'
import SignOutButton from '../auth/sign-out'
import { LuciaUserType } from '@/schemas/userSchema'

interface HeaderProps {
  user?: LuciaUserType
  showExtraButton?: boolean
  buttonName?: string
  dialogTriggerRef?: React.RefObject<HTMLButtonElement>
}

export default function MainLandingNav({
  user,
  showExtraButton = false,
  buttonName = '',
  dialogTriggerRef
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const t = useTranslations('General')

  const handleOpenRegistrationDialog = () => {
    if (dialogTriggerRef?.current) {
      dialogTriggerRef.current.click()
    }
  }

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
              height={90}
              width={90}
              className="mr-2 p-2"
            />
          </Link>

          <div className="flex space-x-3 items-center">
            <LangSelector className="hidden md:block" />
            <nav className="hidden md:flex items-center space-x-4">
              {showExtraButton && (
                <Button
                  size="sm"
                  variant="default"
                  className="font-semibold bg-gradient-to-r from-[#04F1FF] to-[#6de4e8] text-white hover:opacity-90 transition-opacity w-full sm:w-auto"
                  onClick={handleOpenRegistrationDialog}
                >
                  {buttonName}
                </Button>
              )}
              <NavLink href="/events">
                <TicketSlash size={16} />
                <span>{t('events')}</span>
              </NavLink>
              <NavLink href="/communities">
                <Users size={16} />
                <span>{t('communities')}</span>
              </NavLink>
              {!user?.role || Object.keys(user).length === 0 ? (
                <Link href={'/user'}>
                  <Button size="sm" variant="default" className="font-semibold">
                    {t('login')}
                  </Button>
                </Link>
              ) : (
                <AccountDropdown user={user} />
              )}
            </nav>
          </div>

          {/* Mobile view (Hamburger Menu + Extra Button) */}
          <div className="md:hidden flex items-center space-x-4">
            {showExtraButton && (
              <Button
                size="sm"
                variant="default"
                className="font-semibold bg-gradient-to-r from-[#04F1FF] to-[#6de4e8] text-black hover:opacity-90 transition-opacity w-full sm:w-auto"
                onClick={handleOpenRegistrationDialog}
              >
                {buttonName}
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-transparent"
                >
                  <Menu className="h-6 w-6 text-white" />
                  <span className="sr-only text-white">{t('openMenu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-black"
              >
                <SheetHeader>
                  <SheetTitle>{t('menu')}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-4">
                  <NavLink href="/communities" mobile>
                    {t('communities')}
                  </NavLink>
                  <hr className="my-6 border-t border-solid border-white-opacity-40 w-[100%] ml-0 mx-auto" />
                  <NavLink href="/events" mobile>
                    {t('events')}
                  </NavLink>
                  <hr className="my-6 border-t border-solid border-white-opacity-40 w-[100%] ml-0 mx-auto" />
                  {!user?.role ? (
                    <Link href={'/user'}>
                      <Button
                        size="sm"
                        variant="default"
                        className="w-full font-semibold"
                      >
                        {t('login')}
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <NavLink href="/user" mobile>
                        {t('profile')}
                      </NavLink>
                      {user.role === 'ADMIN' && (
                        <>
                          <hr className="my-6 border-t border-solid border-white-opacity-40 w-[100%] ml-0 mx-auto" />
                          <NavLink href="/admin" mobile>
                            {t('organization')}
                          </NavLink>
                        </>
                      )}
                      <hr className="my-6 border-t border-solid border-white-opacity-40 w-[100%] ml-0 mx-auto" />
                      <Link
                        href={'/user/edit'}
                        className="flex items-center space-x-2"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            alt={user.name ?? ''}
                            src={user.picture ?? ''}
                          />
                          <AvatarFallback>
                            {user.name
                              ? user.name.charAt(0).toUpperCase()
                              : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white text-sm">
                          {t('myAccount')}
                        </span>
                      </Link>
                      <hr className="my-6 border-t border-solid border-white-opacity-40 w-[100%] ml-0 mx-auto" />
                      <SignOutButton>
                        <div className="flex items-center space-x-2 px-2">
                          <LogOut className="h-4 w-4 text-muted-foreground" />
                          <span className="text-white text-sm">
                            {t('signOut')}
                          </span>
                        </div>
                      </SignOutButton>
                    </>
                  )}
                  <hr className="my-6 border-t border-solid border-white-opacity-40 w-[100%] ml-0 mx-auto" />
                  <LangSelector />
                </div>
              </SheetContent>
            </Sheet>
          </div>
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
        className={`text-[hsla(0,0%,100%,.79)] hover:text-white hover:bg-transparent text-sm font-medium space-x-0 ${mobile ? 'w-full justify-start text-white' : ''}`}
      >
        {children}
      </Button>
    </Link>
  )
}
