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
import SignOutButton from '@/components/auth/sign-out'

export default async function Page() {
  const user = await getUser()
  if (!user) {
    redirect('/auth')
  }
  if (user.role === Roles.USER) {
    return (
      <main className="flex min-h-[calc(100vh-176px)] items-center justify-center p-4 bg-gradient-to-b from-background/50 to-background">
        <div className="w-full max-w-2xl space-y-6">
          <Card className="border-neutral-800/30 bg-card/90 backdrop-blur-sm">
            <CardHeader className="space-y-6">
              <div className="mx-auto transition-all duration-200 hover:opacity-90">
                <div className="dark:invert">
                  <Image
                    src="/AndinoLabs.svg"
                    alt="Andino Labs Logo"
                    height={100}
                    width={100}
                    className="drop-shadow-sm"
                    priority
                  />
                </div>
              </div>
              <div className="space-y-2 text-center">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  ¡Hola, {user.name}!
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Aquí verás tu historial de eventos y recompensas recibidas
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pb-8">
              <div className="rounded-lg border border-border/50 bg-muted/50 p-6">
                <p className="text-center text-sm text-muted-foreground">
                  Tu historial de actividades aparecerá aquí
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <SignOutButton>Cerrar sesión</SignOutButton>
          </div>
        </div>
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
