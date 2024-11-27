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
import { translations } from '@/lib/translations/translations'
import {
  LayoutDashboard,
  LogOut,
  Settings,
  User as UserIcon
} from 'lucide-react'
import Link from 'next/link'

interface User {
  name?: string
  picture?: string
  email?: string
}
interface AccountDropdownProps {
  readonly user: User | null
  readonly signOut: () => void
}

export function AccountDropdown({ user, signOut }: AccountDropdownProps) {
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
                  alt={user?.email || translations.es.defaultAvatarAlt}
                />
              </Avatar>
            </DropdownMenuTrigger>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm">{translations.es.myAccount}</span>
          <span className="text-xs text-muted-foreground">
            {user?.email || translations.es.guestUser}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={'/admin'} className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{translations.es.organization}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={'/user'} className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{translations.es.profile}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={'/user/edit'} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{translations.es.settings}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
          {translations.es.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
