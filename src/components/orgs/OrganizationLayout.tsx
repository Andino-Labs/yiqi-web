'use client'

import Link from 'next/link'
import {
  MessageSquare,
  Users,
  LogOut,
  Calendar,
  BookUser,
  ChevronDown,
  Building2,
  Banknote
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import SignOutButton from '../auth/sign-out'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger
} from '../ui/sidebar'
import { getAllOrganizationsForCurrentUser } from '@/services/actions/organizationActions'
import { useEffect, useMemo, useState } from 'react'
import { OrganizationType } from '@/schemas/organizerSchema'
import { translations } from '@/lib/translations/translations'

interface UserProps {
  name: string
  email: string
  picture: string | null
  id: string
}

interface AdminLayoutProps {
  children: React.ReactNode
  userProps: UserProps
  orgId: string
}

export default function OrganizationLayout({
  children,
  userProps,
  orgId
}: AdminLayoutProps) {
  const [organizations, setOrganizations] = useState<OrganizationType[]>([])

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const orgs = await getAllOrganizationsForCurrentUser()
        setOrganizations(orgs)
      } catch (error) {
        console.error('Failed to fetch organizations:', error)
      }
    }
    fetchOrganizations()
  }, [])

  const navItems = [
    {
      name: translations.es.chat,
      icon: MessageSquare,
      href: `/admin/organizations/${orgId}/chat`
    },
    {
      name: translations.es.events,
      icon: Calendar,
      href: `/admin/organizations/${orgId}/events`
    },
    {
      name: translations.es.contacts,
      icon: BookUser,
      href: `/admin/organizations/${orgId}/contacts`
    },
    {
      name: translations.es.organizers,
      icon: Users,
      href: `/admin/organizations/${orgId}/organizers`
    },
    {
      name: translations.es.billing,
      icon: Banknote,
      href: `/admin/organizations/${orgId}/billing`
    }
  ]

  const currentOrg = useMemo(
    () => organizations.find(org => org.id === orgId),
    [organizations, orgId]
  )

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Building2 />
                  {currentOrg?.name}
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {organizations.map(org => (
                  <DropdownMenuItem key={org.id}>
                    <Link href={`/admin/organizations/${org.id}`}>
                      {org.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
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
        <main className="flex-1 overflow-auto bg-gray-100">
          <header className="flex items-center justify-between bg-white p-4 shadow-md">
            <SidebarTrigger />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userProps.picture ?? ''} alt="User" />
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
                <DropdownMenuItem>
                  <SignOutButton>
                    <div className="flex items-center gap-4">
                      <span>{translations.es.logOut}</span>
                      <LogOut className="h-4 w-4" />
                    </div>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <div className="p-4">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
