'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { Button } from '@/components/ui/button'
import { MailsIcon, Send, SettingsIcon } from 'lucide-react'

import EventRegistrationTable from './events/EventRegistrationTable'
import EventCommunicationsTable from './events/EventCommunicationsTable'
import { EventRegistrationsSchemaType } from '@/schemas/eventSchema'
import { useTranslations } from 'next-intl'
import { PersonIcon } from '@radix-ui/react-icons'

type Props = {
  registrations: EventRegistrationsSchemaType[]
  eventId: string
}

export function EventAdminView({ registrations, eventId }: Props) {
  const t = useTranslations('DeleteAccount')

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-xl font-bold text-secondary dark:text-gray-100">
        {t('eventManagement')}
      </h2>
      <hr className="my-4 border-t border-solid border-white-opacity-40 w-[100%] mx-auto ml-0" />

      <Tabs defaultValue="attendees">
        {/* TabsList con estilo condicional para los íconos */}
        <TabsList className="mb-4 flex gap-4">
          <TabsTrigger
            value="attendees"
            className="px-4 py-2 rounded-t-md flex items-center transition-all"
            data-state="active" // Aquí se utiliza la propiedad data-state
          >
            <div className="flex items-center">
              <PersonIcon className="h-7 w-7 mr-2" />
              <span className="hidden sm:inline">{t('attendees')}</span>
            </div>
          </TabsTrigger>

          <TabsTrigger
            value="settings"
            className="px-4 py-2 rounded-t-md flex items-center transition-all"
            data-state="active" // Aquí también se utiliza la propiedad data-state
          >
            <div className="flex items-center">
              <SettingsIcon className="h-7 w-7 mr-2" />
              <span className="hidden sm:inline">{t('settings')}</span>
            </div>
          </TabsTrigger>

          <TabsTrigger
            value="communications"
            className="px-4 py-2 rounded-t-md flex items-center transition-all"
            data-state="active" // Aquí también se utiliza la propiedad data-state
          >
            <div className="flex items-center">
              <MailsIcon className="h-7 w-7 mr-2" />
              <span className="hidden sm:inline">{t('communications')}</span>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Contenido de los Tabs */}
        <TabsContent value="attendees">
          <h2 className="text-xl font-semibold mb-2">
            {t('eventRegistrations')}
          </h2>
          <EventRegistrationTable registrations={registrations} />
        </TabsContent>

        <TabsContent value="settings">
          <h2 className="text-xl font-semibold mb-2">{t('eventSettings')}</h2>
          <p className="text-gray-700 dark:text-gray-300">
            {t('settingsDescription')}
          </p>
        </TabsContent>

        <TabsContent value="communications">
          <h2 className="text-xl font-semibold mb-2">
            {t('eventCommunications')}
          </h2>
          <div className="flex flex-col space-y-4">
            <Button className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-all">
              <Send className="w-4 h-4 mr-2" />
              {t('sendNewCommunication')}
            </Button>
            <EventCommunicationsTable eventId={eventId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
