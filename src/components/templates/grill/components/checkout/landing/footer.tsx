// React and Next.js imports
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
// Icon imports
import { Twitter } from 'lucide-react'

// Asset imports
import Logo from '@/public/logo.svg'
import { Container, Section } from '../mainLayout'
import { InstagramLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'

export default function Footer() {
  return (
    <footer>
      <Section className="backdrop-blur-md bg-black bg-opacity-40">
        <Container className="grid gap-6 ">
          <div className="not-prose flex flex-col gap-6">
            <Link href="/">
              <h3 className="sr-only">brijr/components</h3>
              <Image
                src={Logo}
                alt="Logo"
                width={120}
                height={27.27}
                className="transition-all hover:opacity-75 dark:invert"
              ></Image>
            </Link>
          </div>
          <div className="mb-4 flex flex-col gap-4 md:mb-0 md:flex-row"></div>
        </Container>
        <Container className="not-prose flex flex-col justify-between gap-6 border-t md:flex-row md:items-center md:gap-2">
          <div className="flex gap-2">
            <Link href="https://www.linkedin.com/company/andino-labs/">
              <Button variant="outline" size="icon">
                <LinkedInLogoIcon className="w-6 h-6" />
              </Button>
            </Link>
            <Link href="https://twitter.com/andinodao">
              <Button variant="outline" size="icon">
                <Twitter />
              </Button>
            </Link>
            <Link href="https://www.instagram.com/andinolabs/">
              <Button variant="outline" size="icon">
                <InstagramLogoIcon className="w-6 h-6" />
              </Button>
            </Link>
          </div>
          <p className="text-muted-foreground">
            © <a href="https://instagram.com/andinolabs">AndinoLabs</a>. All
            rights reserved. 2024-present.
          </p>
        </Container>
      </Section>
    </footer>
  )
}
