'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const TabHeader = ({
  options
}: {
  options: { label: string; href: string }[]
}) => {
  const pathname = usePathname()

  return (
    <div className="flex mb-4 border-b overflow-x-auto">
      {options.map(option => {
        const isActiveLink = pathname.includes(option.href)
        return (
          <Link
            key={option.href}
            href={`./${option.href}`}
            className={`block py-2 px-5 border-b whitespace-nowrap ${isActiveLink ? 'font-bold border-b-white' : 'text-white text-opacity-70'}`}
          >
            {option.label}
          </Link>
        )
      })}
    </div>
  )
}
