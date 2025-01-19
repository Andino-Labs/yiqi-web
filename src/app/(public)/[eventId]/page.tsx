import { EventPage } from '@/components/lumalike/template1'
import { getUser } from '@/lib/auth/lucia'
import { getEventById } from '@/services/actions/event/getEventById'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { JSDOM } from 'jsdom'
type Props = {
  params: { eventId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventById(params.eventId)

  if (!event) {
    return {
      title: 'Event Not Found'
    }
  }

  // Create a JSDOM instance
  const dom = new JSDOM(event.description || '')
  const text = dom.window.document.body.textContent || ''
  const ogImage = event.openGraphImage || event.heroImage || '/og.png'

  const description =
    text ||
    event.subtitle ||
    `Join us at ${event.title} on ${event.startDate.toLocaleDateString()}`
  return {
    title: event.title,
    description: description,
    openGraph: {
      title: event.title,
      description: description,
      images: [ogImage]
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: description,
      images: [ogImage]
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_URL}/events/${event.id}`
    }
  }
}

export default async function Page({
  params
}: {
  params: { eventId: string }
}) {
  const user = await getUser()
  const event = await getEventById(params.eventId)

  if (!event) {
    redirect('/')
  }

  return (
    <>
      <div className="fixed inset-0 h-screen w-screen -z-10 bg-black"></div>
      <EventPage
        event={event}
        user={{
          email: user?.email,
          name: user?.name,
          role: user?.role,
          picture: user?.picture || undefined
        }}
      />
    </>
  )
}
