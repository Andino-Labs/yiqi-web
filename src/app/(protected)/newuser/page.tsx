import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import Image from 'next/image'
import {
  BeEventAdmin,
  BeRegularUserButton
} from '@/components/newuser/newUserActions'
import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import { getTranslations } from 'next-intl/server'

export default async function Page() {
  const t = await getTranslations('user')
  const user = await getUser()
  if (!user) {
    redirect(`/auth`)
  }

  if (user.role === Roles.NEW_USER) {
    return (
      <main className="flex flex-col items-center justify-center h-screen">
        <Card className="flex flex-col items-center justify-center">
          <CardHeader className="flex flex-col items-center justify-center gap-3">
            <div style={{ filter: 'brightness(0)' }}>
              <Image src={'/AndinoLabs.svg'} alt="" height={100} width={100} />
            </div>
            <CardTitle>{t('useCase')}</CardTitle>
            <CardDescription>{t('choose')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-3">
            <BeRegularUserButton userId={{ value: user.id }} />
            <BeEventAdmin value={user.id} />
          </CardContent>
        </Card>
      </main>
    )
  } else if (user.role === Roles.ADMIN) {
    redirect(`/admin`)
  } else if (user.role === Roles.USER) {
    redirect('/user/networking-settings')
  } else if (user.role === Roles.ANDINO_ADMIN) {
    redirect(`/andino-admin`)
  }
}
