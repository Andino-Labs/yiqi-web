'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

import EventRegistrationTable from './events/EventRegistrationTable'
import EventCommunicationsTable from './events/EventCommunicationsTable'
import { EventRegistrationsSchemaType } from '@/schemas/eventSchema'

type Props = {
  registrations: EventRegistrationsSchemaType[]
  eventId: string
}

export function EventAdminView({ registrations, eventId }: Props) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event Management</h1>
      <Tabs defaultValue="attendees">
        <TabsList className="mb-4">
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>
        <TabsContent value="attendees">
          <h2 className="text-xl font-semibold mb-2">Event Registrations</h2>

          <EventRegistrationTable registrations={registrations} />
        </TabsContent>

        <TabsContent value="communications">
          <h2 className="text-xl font-semibold mb-2">Event Communications</h2>

          <Button className="mt-4">
            <Send className="w-4 h-4 mr-2" /> Send New Communication
            <EventCommunicationsTable eventId={eventId} />
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
