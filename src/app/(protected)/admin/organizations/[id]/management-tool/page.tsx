import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import { SidebarChannel } from '@/components/management-tool/sidebarChannel/sidebarChannel'
import CalendarPage from '@/components/management-tool/ManagementTool'

import { getTwitterAccountByUserId } from '@/services/actions/management-tool/channels/twitter/getTwitterAccountByUserId'
import getTwitterAnalytics from '@/lib/twitter/getTwitterAnalytics'
import { getTranslations } from 'next-intl/server'

export default async function ManagementTool({
  params
}: {
  params: { id: string }
}) {
  const user = await getUser()
  const t = await getTranslations('ManagementTool')
  const organizationId = params.id

  if (!user) {
    redirect('/auth')
  }

  const dataTwitter = await getTwitterAccountByUserId(user.id, organizationId)

  let analytics
  if (dataTwitter && 'accountId' in dataTwitter) {
    analytics = await getTwitterAnalytics(
      dataTwitter.accountId,
      organizationId,
      user.id
    )
  } else {
    analytics = null
  }

  if (user.role === Roles.ADMIN) {
    return (
      <main className="block items-center justify-center min-h-screen">
        <div className="flex flex-col lg:flex-row w-full">
          <SidebarChannel data={dataTwitter} />
          <div className="flex-1 mt-4 lg:mt-0 flex items-center justify-center">
            {dataTwitter && dataTwitter.accountId !== '' ? (
              <CalendarPage
                data={dataTwitter}
                organizationId={organizationId}
                analytics={analytics}
                userId={user.id}
              />
            ) : (
              <p className="text-3xl font-bold text-center">
                {t('connectYourAccount')}
              </p>
            )}
          </div>
        </div>
      </main>
    )
  }
}
