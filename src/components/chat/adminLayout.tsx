import Link from 'next/link'
import { Settings, Users, Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
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
import { SidebarProvider } from '../ui/sidebar'
import { useTranslations } from 'next-intl'

interface UserProps {
  name: string
  email: string
  picture: string
}

interface AdminLayoutProps {
  children: React.ReactNode
  userProps: UserProps
}

export default function AdminLayout({ children, userProps }: AdminLayoutProps) {
  const t = useTranslations('AdminLayout')
  const navItems = [
    {
      name: `${t('organization')}`,
      icon: Users,
      href: `/admin`
    },
    {
      name: `${t('settings')}`,
      icon: Settings,
      href: `/admin/settings`
    }
  ]

  return (
    <SidebarProvider>
      <div className="w-full flex h-screen bg-gray-100">
        {/* Sidebar for larger screens */}
        <aside className="hidden w-64 bg-white p-4 shadow-md lg:block">
          <nav className="space-y-2">
            {navItems.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 rounded-lg px-2 py-1.5 text-gray-700 hover:bg-gray-200"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed left-4 top-4 z-50 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <nav className="space-y-2">
              {navItems.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 rounded-lg px-2 py-1.5 text-gray-700 hover:bg-gray-200"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="flex items-center justify-between bg-white p-4 shadow-md">
            <h1 className="text-2xl font-bold">Andino Labs - HUB</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProps.picture} alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
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
                    <div className="flex flex-row items-center justify-center gap-4">
                      <span>{t('logout')}</span>
                      <LogOut className="mr-2 h-4 w-4" />
                    </div>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <div className="p-4">
            {/* Breadcrumb 
          <nav className="mb-4 text-sm font-medium text-gray-500">
            <ol className="inline-flex list-none p-0">
              <li className="flex items-center">
                <Link href="/" className="hover:text-gray-700">
                  Home
                </Link>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <span className="text-gray-700">Current Page</span>
              </li>
            </ol>
          </nav>
*/}
            {/* Page content placeholder */}
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
