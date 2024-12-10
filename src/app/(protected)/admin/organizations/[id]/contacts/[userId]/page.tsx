import { getOrganization } from '@/services/actions/organizationActions'
import { getContactDetails } from '@/services/actions/contactActions'

import { getUserMessageList } from '@/services/actions/communications/getUserMessageList'
import * as Tabs from '@radix-ui/react-tabs'
import ConnectedChat from '@/components/chat/connectedChat'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ContactText2 } from '@/components/contactText'

export default async function ContactDetailsPage({
  params
}: {
  params: { id: string; userId: string }
}) {
  const organization = await getOrganization(params.id)
  const contact = await getContactDetails(params.userId, params.id)
  const messages = await getUserMessageList(params.userId, params.id)

  const t = await getTranslations('contactText')

  if (!organization || !contact) {
    return <div>Contact or Organization not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {t('contactDetails')} {contact.name}
      </h1>
      <Tabs.Root defaultValue="messages" className="w-full">
        <Tabs.List>
          <Tabs.Trigger value="messages">{t('Messages')}</Tabs.Trigger>
          <Tabs.Trigger value="events">{t('attendEvents')}</Tabs.Trigger>
          <Tabs.Trigger value="details">{t('userDetails')}</Tabs.Trigger>
        </Tabs.List>

        <div className="pt-3">
          <Tabs.Content value="messages">
            <div className="h-[600px]">
              <ConnectedChat
                defaultMessages={messages}
                userId={params.userId}
                orgId={params.id}
                allowedMessageTypes={messages.map(
                  message => message.messageThread.type
                )}
              />
            </div>
          </Tabs.Content>

          <Tabs.Content value="events">
            <h2 className="text-xl font-bold mt-4 mb-2">
              {t('AttendedEvents')}
            </h2>
            <ul className="space-y-2">
              {contact.registeredEvents?.map(attendee => (
                <li key={attendee.id} className="border p-2 rounded">
                  <Link
                    href={`/admin/organizations/${params.id}/events/${attendee.event.id}`}
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
          </Tabs.Content>

          <Tabs.Content value="details">
            <div className="space-y-2">
              <p>
                <strong>{t('Name')}</strong> {contact.name}
              </p>
              <p>
                <strong>{t('Email')}</strong> {contact.email}
              </p>
              <p>
                <strong>{t('number')}</strong> {contact.phoneNumber || 'N/A'}
              </p>
              <h3 className="text-lg font-semibold mt-4 mb-2">
                {t('additionalData')}
              </h3>
              <ContactText2
                email={contact.email}
                name={contact.name}
                phoneNumber={contact.phoneNumber}
              />
              {contact.dataCollected && (
                <div className="border p-2 rounded">
                  {Object.entries(contact.dataCollected).map(([key, value]) => (
                    <p key={key}>
                      <strong>{key}:</strong> {JSON.stringify(value)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>
      <Link
        href={`/admin/organizations/${params.id}/contacts`}
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        {t('back')}
      </Link>
    </div>
  )
}
