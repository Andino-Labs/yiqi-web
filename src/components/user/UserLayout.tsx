'use client'

import Link from 'next/link'
import {
  User,
  CreditCard,
  History,
  Ticket,
  Speech,
  LogOut,
  UserIcon,
  Settings,
  HomeIcon,
  LayoutDashboard
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger
} from '../ui/sidebar'
import { useTranslations } from 'next-intl'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import SignOutButton from '../auth/sign-out'
import Image from 'next/image'
interface UserProps {
  name: string
  email: string
  picture: string
  id: string
  role: string
}

interface UserLayoutProps {
  children: React.ReactNode
  userProps: UserProps
}

export default function UserLayout({ children, userProps }: UserLayoutProps) {
  const t = useTranslations('AddOrganizer')
  const navItems = [
    {
      name: `${t('profileSettings')}`,
      icon: User,
      href: `/user/edit`
    },
    {
      name: `${t('payments')}`,
      icon: CreditCard,
      href: `/user/payments`
    },
    {
      name: `${t('history')}`,
      icon: History,
      href: `/user/history`
    },
    {
      name: `${t('tickets')}`,
      icon: Ticket,
      href: `/user/tickets`
    },
    {
      name: `${t('networkingSettings')}`,
      icon: Speech,
      href: `/user/networking-settings`
    }
  ]

  return (
    <SidebarProvider className="bg-primary">
      <div className="flex  w-full bg-primary">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <Link href={'/'} className="flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    height={90}
                    width={90}
                    className="mr-2 p-2"
                  />
                </Link>
                {navItems.map(item => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href}>
                        <item.icon className="mr-2 h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 overflow-auto bg-gray-100 bg-primary">
          <header className="flex items-center justify-between p-4 shadow-md bg-primary">
            <SidebarTrigger />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userProps.picture} alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userProps.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userProps.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/user`} className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{t('profile')}</span>
                  </Link>
                </DropdownMenuItem>
                {userProps.role === 'ADMIN' && (
                  <DropdownMenuItem asChild>
                    <Link href={`/admin`} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{t('organization')}</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href={`/user/edit`} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{t('settings')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/`} className="cursor-pointer">
                    <HomeIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Home</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignOutButton>
                    <div className="flex items-center gap-4">
                      <span>{t('logOut')}</span>
                      <LogOut className="h-4 w-4" />
                    </div>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  )
}
