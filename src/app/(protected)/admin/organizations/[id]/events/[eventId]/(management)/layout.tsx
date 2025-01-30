import { TabHeader } from './_components/TabHeader'

export default async function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const tabOptions = [
    { href: 'summary', label: 'Event Summary' },
    { href: 'attendes', label: 'Attendees' },
    { href: 'registration', label: 'Registration' },
    { href: 'broadcasts', label: 'Broadcasts' }
  ]
  return (
    <div>
      <TabHeader options={tabOptions} />
      {children}
    </div>
  )
}
