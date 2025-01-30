'use client'
import * as Tabs from '@radix-ui/react-tabs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const TabHeader = ({
  options
}: {
  options: { label: string; href: string }[]
}) => {
  const pathname = usePathname()
  return (
    <Tabs.Root className="mb-4 border-b">
      <Tabs.List>
        {options.map(option => {
          const isActiveLink = pathname.includes(option.href)
          return (
            <Link key={option.href} href={`./${option.href}`}>
              <Tabs.Trigger
                value={option.href}
                className={`py-2 px-5 border-b ${isActiveLink && 'font-bold border-b-white'}`}
              >
                {option.label}
              </Tabs.Trigger>
            </Link>
          )
        })}
      </Tabs.List>
    </Tabs.Root>
  )
}
