import { getContactDetails } from '@/services/actions/contactActions'
import { getUserMessageList } from '@/services/actions/communications/getUserMessageList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import ConnectedChat from '@/components/chat/connectedChat'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ContactText2 } from '@/components/contactText'
import { ArrowLeft } from 'lucide-react'

export default async function ContactDetailsPage({
  params
}: {
  params: { id: string; userId: string }
}) {
  const contact = await getContactDetails(params.userId, params.id)
  const messages = await getUserMessageList(params.userId, params.id)

  const t = await getTranslations('contactText')

  if (!contact) {
    return <div>Contact not found</div>
  }

  return (
    <section className="w-full h-full sm:p-4 rounded-lg sm:border text-card-foreground shadow-sm bg-primary">
      <div className="container mx-auto gap-2">
        <div className="w-full flex justify-start mb-4 gap-2">
          <Link
            href={`/admin/organizations/${params.id}/contacts`}
            className="mt-1 inline-block text-primary hover:underline"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold mb-4">
            {t('contactDetails')} {contact.name}
          </h1>
        </div>

        <Tabs defaultValue="messages">
          <TabsList className="mb-4 flex border-b">
            <TabsTrigger
              className="px-4 py-2 text-sm sm:text-lg rounded-t-md flex items-center transition-all 
                  data-[state=active]:bg-sidebar-accent data-[state=active]:text-primary
                  data-[state=inactive]:bg-transparent data-[state=inactive]:text-primary"
              value="messages"
            >
              {t('messages')}
            </TabsTrigger>

            <TabsTrigger
              className="px-4 py-2 text-sm sm:text-lg rounded-t-md flex items-center transition-all 
                  data-[state=active]:bg-sidebar-accent data-[state=active]:text-primary
                  data-[state=inactive]:bg-transparent data-[state=inactive]:text-primary"
              value="events"
            >
              {t('attendEvents')}
            </TabsTrigger>

            <TabsTrigger
              className="px-4 py-2 text-sm sm:text-lg rounded-t-md flex items-center transition-all 
                  data-[state=active]:bg-sidebar-accent data-[state=active]:text-primary
                  data-[state=inactive]:bg-transparent data-[state=inactive]:text-primary"
              value="details"
            >
              {t('userDetails')}
            </TabsTrigger>
          </TabsList>

          <div className="pt-3">
            <TabsContent value="messages">
              <div className="h-full">
                <ConnectedChat
                  defaultMessages={messages}
                  userId={params.userId}
                  orgId={params.id}
                  allowedMessageTypes={messages.map(
                    message => message.messageThread.type
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="events" className="p-6">
              <h2 className="text-2xl font-bold mb-4">{t('attendedEvents')}</h2>

              {contact.registeredEvents?.length ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contact.registeredEvents.map(attendee => (
                    <li
                      key={attendee.id}
                      className="dark:bg-primary shadow rounded-lg p-4"
                    >
                      <Link
                        href={`/admin/organizations/${params.id}/events/${attendee.event.id}`}
                        className="text-lg font-semibold dark:text-secondary hover:underline"
                      >
                        {attendee.event.title}
                      </Link>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <strong>{t('status')}: </strong> {attendee.status}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  {t('noEvents')}
                </p>
              )}
            </TabsContent>

            <TabsContent value="details" className="p-6">
              <h2 className="text-2xl font-bold mb-4">{t('userDetails')}</h2>

              <div className="dark:bg-primary shadow rounded-lg py-6 space-y-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong className="font-semibold text-sm">
                    {t('name')}:{' '}
                  </strong>{' '}
                  {contact.name || t('na')}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong className="font-semibold text-sm">
                    {t('email')}:{' '}
                  </strong>{' '}
                  {contact.email || t('na')}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong className="font-semibold text-sm">
                    {t('phoneNumber')}:{' '}
                  </strong>{' '}
                  {contact.phoneNumber || t('na')}
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  {t('additionalData')}
                </h3>

                <ContactText2
                  email={contact.email}
                  name={contact.name}
                  phoneNumber={contact.phoneNumber}
                />

                {contact.dataCollected && (
                  <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 space-y-2">
                    {Object.entries(contact.dataCollected).map(
                      ([key, value]) => (
                        <p
                          key={key}
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          <strong className="font-semibold">{key}: </strong>{' '}
                          {JSON.stringify(value)}
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  )
}
