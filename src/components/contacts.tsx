'use client'

import { ImportContactButton } from '@/app/(protected)/admin/organizations/[id]/contacts/ImportContactButton'
import { ImportContactTemplateButton } from '@/app/(protected)/admin/organizations/[id]/contacts/ImportContactTemplateButton'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface Contact {
  id: string
  name: string
  email: string
  picture: string | null
  emailVerified?: Date | null | undefined
  phoneNumber?: string | null | undefined
}

export default function ContactText(props: {
  id: string
  name: string
  organizationId: string
  contacts: Contact[]
}) {
  const t = useTranslations('contactFor')
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          <span>{t('contactsFor')}</span> {props.name}
        </h1>
        <ImportContactButton organizationId={props.organizationId} />
      </div>
      <div className="mb-2 mt-2">
        <ImportContactTemplateButton />
      </div>
      <ul className="space-y-2">
        {props.contacts.map(user => (
          <li key={props.id} className="border p-2 rounded">
            <Link
              href={`/admin/organizations/${props.id}/contacts/${user?.id}`}
              className="text-blue-500 hover:underline"
            >
              {user?.name} ({user?.email})
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={`/admin/organizations/${props.id}`}
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        <span>{t('backToDashboard')}</span>
      </Link>
    </div>
  )
}

export function ContactText1() {
  const t = useTranslations('DeleteAccount')
  return <div>{t('noOrganizationFound')}</div>
}
