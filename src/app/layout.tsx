import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import MainLandingNav from '@/components/mainLanding/mainNav'
import { getUser } from '@/lib/auth/lucia'
import { logOut } from '@/services/auth/auth'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export const metadata: Metadata = {
  title: 'Yiqi, Bringing people together',
  description:
    'Yiqi is a platform for bringing people together through professional communities. Find your tribe, learn, grow, and connect.'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {

  const user = await getUser()

  return (
    <html lang="en" className="h-screen w-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-full`}
      >
      <MainLandingNav
        user={{ name: user?.name, picture: user?.picture as string }}
        logOut={logOut}
      />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
