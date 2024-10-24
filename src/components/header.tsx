import { MoveUpRight } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import { getUser } from '@/lib/auth/lucia'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export default async function Header() {
  const user = await getUser()
  return (
    <header className=" top-0 z-10 bg-white/50 px-6 py-5 dark:border-white/10 dark:bg-black backdrop-blur-xl lg:z-10 lg:flex lg:h-20 lg:items-center lg:px-8 lg:py-0">
      <div className="mx-auto flex w-full items-center justify-between md:max-w-7xl">
        <div
          className="flex items-center space-x-3 text-xl font-extrabold text-transparent bg-clip-text"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #6de4e8, rgba(0, 178, 218, 0.6) 95.83%)'
          }}
        >
          <span className="rounded-full bg-cyan-500 p-2 text-white">🚀</span>
          <span>Tiqi</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/events">
            <Button
              size="sm"
              variant="ghost"
              className="border font-bold text-[12px] space-x-1"
            >
              <span>Explore Events</span>
              <MoveUpRight size={18} />
            </Button>
          </Link>

          {!user ? (
            <Link href={'/user'}>
              <Button
                color="primary"
                size="sm"
                className="font-semibold hidden sm:flex text-[12px]"
              >
                Log in
              </Button>
            </Link>
          ) : (
            <Link href={'/admin'}>
              <Avatar className="w-8 h-8">
                <AvatarImage alt={user?.name ?? ''} src={user?.picture ?? ''} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
