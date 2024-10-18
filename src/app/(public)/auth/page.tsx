import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription
} from '@/components/ui/card'
import GoogleOAuthButton from '@/components/auth/googleButton'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default async function Page() {
  return (
    <main className="flex flex-col h-screen items-center justify-center">
      <section className="px-4">
        <Card className="flex flex-col items-center justify-center">
          <CardHeader>
            <div style={{ filter: 'brightness(0)' }}>
              <Image src={'/AndinoLabs.svg'} alt="" height={100} width={100} />
            </div>
          </CardHeader>
          <CardContent>
            <GoogleOAuthButton />
          </CardContent>
          <CardFooter>
            <CardDescription>
              En caso de problemas ingresando, comuniquese a{' '}
              <Button className="p-0" asChild variant={'link'}>
                <Link href="https://wa.me/51943056060">soporte tecnico</Link>
              </Button>
            </CardDescription>
          </CardFooter>
        </Card>
      </section>
    </main>
  )
}
