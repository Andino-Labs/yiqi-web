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
  // Banknote,
  Plus,
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
import { useTranslations } from 'next-intl'
import { Button } from '../ui/button'

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
  showExtraButton?: boolean
  buttonName?: string
  dialogTriggerRef?: React.RefObject<HTMLButtonElement>
}

export default function OrganizationLayout({
  children,
  userProps,
  orgId,
  showExtraButton = false,
  buttonName = '',
  dialogTriggerRef
}: AdminLayoutProps) {
  const t = useTranslations('Sidebar')
  const [organizations, setOrganizations] = useState<OrganizationType[]>([])

  const handleBulkSendClick = () => {
    if (dialogTriggerRef?.current) {
      dialogTriggerRef.current.click()
    }
  }
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
      name: `${t('chat')}`,
      icon: MessageSquare,
      href: `/admin/organizations/${orgId}/chat`
    },
    {
      name: `${t('events')}`,
      icon: Calendar,
      href: `/admin/organizations/${orgId}/events`
    },
    {
      name: `${t('contacts')}`,
      icon: BookUser,
      href: `/admin/organizations/${orgId}/contacts`
    },
    {
      name: `${t('organizers')}`,
      icon: Users,
      href: `/admin/organizations/${orgId}/organizers`
    },
    {
      name: `${t('billing')}`,
      icon: Banknote,
      href: `/admin/organizations/${orgId}/billing`
    },
    {
      name: 'Formularios',
      icon: Plus,
      href: `/admin/organizations/${orgId}/forms`
    }
  ]
  const currentOrg = useMemo(
    () => organizations.find(org => org.id === orgId),
    [organizations, orgId]
  )

  return (
    <SidebarProvider className="bg-primary">
      <div className="flex h-full w-full bg-primary">
        <Sidebar collapsible="icon" className="bg-primary">
          <SidebarHeader>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Building2 />
                  {currentOrg?.name}
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-primary">
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
        <main className="flex flex-col flex-1 h-full overflow-hidden bg-primary">
          <header className="flex items-center justify-between p-4 shadow-md bg-primary">
            <SidebarTrigger className="bg-primary text-primary" />
            <div className="flex items-center gap-4">
              {/* Botón para enviar masivamente */}
              {showExtraButton && (
                <Button
                  variant="outline"
                  className="font-bold"
                  onClick={handleBulkSendClick}
                >
                  {buttonName}
                </Button>
              )}
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
                        <span>{t('logOut')}</span>
                        <LogOut className="h-4 w-4" />
                      </div>
                    </SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div className="flex-1 overflow-auto px-4 bg-primary h-screen">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export function EventText(props: { id: string }) {
  const t = useTranslations('EventsList')
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{t('events')}</h1>
      <Link
        href={`/admin/organizations/${props.id}/events/new`}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        {t('createNewEvents')}
      </Link>
    </div>
  )
}

export function EventText2(props: { id: string }) {
  const t = useTranslations('EventsPage')
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{t('createNewEvent')}</h1>
      <Link
        href={`/admin/organizations/${props.id}/events`}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-primary transition-colors"
      >
        {t('cancel')}
      </Link>
    </div>
  )
}
