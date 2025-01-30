'use client'
import * as Tabs from '@radix-ui/react-tabs'
import Link from 'next/link'

export const TabHeader = ({
  options
}: {
  options: { label: string; href: string }[]
}) => {
  return (
    <Tabs.Root className="" defaultValue="tab1">
      <Tabs.List className="space-x-6">
        {options.map(option => (
          <Tabs.Trigger key={option.href} value={option.href}>
            <Link href={`./${option.href}`}>{option.label}</Link>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  )
}
