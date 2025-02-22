'use client'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  LayoutDashboard,
  LogOut,
  Settings,
  User as UserIcon
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import SignOutButton from './auth/sign-out'

interface User {
  name?: string
  picture?: string | null
  email?: string
  role?: string
}

export function AccountDropdown({ user }: { user: User }) {
  const t = useTranslations('AccountDropdown')
  return (
    <DropdownMenu modal={false}>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarImage
                  src={
                    user?.picture ?? `https://avatar.vercel.sh/${user?.email}`
                  }
                  alt={user?.email || `${t('defaultAvatarAlt')}`}
                />
              </Avatar>
            </DropdownMenuTrigger>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm">{t('myAccount')}</span>
          <span className="text-xs text-muted-foreground">
            {user?.email || `${t('guestUser')}`}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/user`} className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{t('profile')}</span>
          </Link>
        </DropdownMenuItem>
        {user?.role === 'ADMIN' && (
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
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutButton>
            <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
            {t('signOut')}
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
