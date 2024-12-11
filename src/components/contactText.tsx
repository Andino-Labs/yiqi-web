'use client'
import Link from 'next/link'
import * as Tabs from '@radix-ui/react-tabs'
import { useTranslations } from 'next-intl'
import { ContactDetailsType } from '@/services/actions/contactActions'

export function TabList() {
  const t = useTranslations('contactText')
  return (
    <Tabs.List>
      <Tabs.Trigger value="messages">{t('Messages')}</Tabs.Trigger>
      <Tabs.Trigger value="events">{t('attendEvents')}</Tabs.Trigger>
      <Tabs.Trigger value="details">{t('userDetails')}</Tabs.Trigger>
    </Tabs.List>
  )
}

export function ContactText1(props: { name: string }) {
  const t = useTranslations('contactText')
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {t('contactDetails')} {props.name}
      </h1>
    </div>
  )
}

export function ContactText2(props: {
  name: string
  email: string
  phoneNumber: string | null
}) {
  const t = useTranslations('contactText')

  return (
    <div className="space-y-2">
      <p className="text-sm">
        <strong className="text-s">{t('Name')}</strong> {props.name}
      </p>
      <p className="text-sm">
        <strong className="text-s">{t('Email')}</strong> {props.email}
      </p>
      <p className="text-sm">
        <strong className="text-s">{t('number')}</strong>{' '}
        {props.phoneNumber || 'N/A'}
      </p>
      <h3 className="text-lg font-semibold mt-4 mb-2">{t('additionalData')}</h3>
    </div>
  )
}

export function ContactText3(props: {
  id: string
  contact: ContactDetailsType | null
}) {
  const t = useTranslations('contactText')
  // Handle case where props.contact is null
  if (!props.contact) {
    return <p>No contact details available.</p>
  }
  return (
    <div className="">
      <h2 className="text-xl font-bold mt-4 mb-2">{t('AttendedEvents')}</h2>
      <ul className="space-y-2">
        {props.contact.registeredEvents?.map(attendee => (
          <li key={attendee.id} className="border p-2 rounded">
            <Link
              href={`/admin/organizations/${props.id}/events/${attendee.event.id}`}
              className="text-blue-500 hover:underline"
            >
              {attendee.event.title}
            </Link>
            <p>
              {t('Status')} {attendee.status}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Link1(props: { id: string }) {
  const t = useTranslations('contactText')
  return (
    <Link
      href={`/admin/organizations/${props.id}/contacts`}
      className="mt-4 inline-block text-blue-500 hover:underline"
    >
      {t('back')}
    </Link>
  )
}
