import { getTranslations } from 'next-intl/server'
import { TabHeader } from './_components/TabHeader'

export default async function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const t = await getTranslations('ManagementEventTabs')
  const tabOptions = [
    { href: 'summary', label: t('summary') },
    { href: 'attendes', label: t('attendes') },
    { href: 'registration', label: t('registration') },
    { href: 'broadcasts', label: t('broadcasts') }
  ]
  return (
    <div>
      <TabHeader options={tabOptions} />
      {children}
    </div>
  )
}
