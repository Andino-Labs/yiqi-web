import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import GoogleOAuthButton from '@/components/auth/googleButton'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import LinkedInOAuthButton from '@/components/auth/LinkedinButton'

export default async function Page() {
  return (
    <main className="flex min-h-[calc(100vh-176px)] items-center justify-center p-4 bg-gradient-to-b from-background/50 to-background">
      <Card className="w-full max-w-[400px] border-neutral-800/30 bg-neutral-900/90 backdrop-blur-sm">
        <CardHeader className="space-y-6 px-6 pt-6">
          <div className="mx-auto transition-all duration-200 hover:opacity-90">
            <Image
              src="/AndinoLabs.svg"
              alt="Andino Labs Logo"
              height={100}
              width={100}
              className="drop-shadow-sm"
              priority
            />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Welcome to Yiqi
            </h1>
            <p className="text-sm text-neutral-400">
              Please sign in or sign up below
            </p>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-8">
          <div className="space-y-4 ">
            <GoogleOAuthButton />
            <LinkedInOAuthButton />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center border-t border-neutral-800/50 px-6 py-4">
          <p className="text-sm text-neutral-400">
            En caso de problemas ingresando, comuníquese a{' '}
            <Button
              className="h-auto p-0 font-medium text-primary hover:text-primary/90"
              asChild
              variant="link"
            >
              <Link href="https://wa.me/51943056060">soporte técnico</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}
