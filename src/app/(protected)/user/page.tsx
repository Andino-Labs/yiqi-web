import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import Image from 'next/image'
import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'

export default async function Page() {
  const user = await getUser()
  if (!user) {
    redirect('/auth')
  }
  if (user.role === Roles.USER) {
    return (
      <main className="flex flex-col items-center justify-center h-screen">
        <Card className="flex flex-col items-center justify-center">
          <CardHeader className="flex flex-col items-center justify-center gap-3">
            <div style={{ filter: 'brightness(0)' }}>
              <Image src={'/AndinoLabs.svg'} alt="" height={100} width={100} />
            </div>
            <CardTitle>Hola! {user.name}</CardTitle>
            <CardDescription>
              Aquí verás tu historial de eventos y recompensas recibidas!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-3"></CardContent>
        </Card>
      </main>
    )
  } else if (user.role === Roles.ADMIN) {
    redirect('/admin')
  } else if (user.role === Roles.NEW_USER) {
    redirect('/newuser')
  } else if (user.role === Roles.ANDINO_ADMIN) {
    redirect('/andino-admin')
  }
}
