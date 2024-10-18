import { User, Event } from '@prisma/client'
import { ReactElement } from 'react'

import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Link,
  Img
} from '@react-email/components'

// Define the props types for each template
export interface ReservationReminderProps {
  user: User
  event: Event
}

export function ReservationReminder({
  user,
  event
}: ReservationReminderProps): ReactElement {
  const { name } = user
  const { title: eventName, startDate, endDate, location, id } = event

  // Placeholder for dynamic link, replace with actual link
  const inviteLink = `https://mi-plataforma.com/evento/${id}`

  return (
    <Html>
      <Head />
      <Preview>Recordatorio de tu reservación para {eventName}</Preview>
      <Body className="bg-gray-100">
        <Container className="mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
          <Heading className="text-2xl font-bold text-center text-gray-800 mb-4">
            ¡Hola, {name}!
          </Heading>
          <Text className="text-lg text-gray-600 mb-4">
            No te olvides de asistir al evento <strong>{eventName}</strong> que
            se llevará a cabo desde el{' '}
            <strong>{new Date(startDate).toLocaleDateString()}</strong>
            hasta el <strong>
              {new Date(endDate).toLocaleDateString()}
            </strong>{' '}
            en
            <strong> {location}</strong>.
          </Text>
          <Img
            src="https://via.placeholder.com/600x300"
            alt="Imagen del evento"
            className="w-full mb-6 rounded-lg"
          />
          <Text className="text-lg text-gray-600 mb-4">
            ¡Será una experiencia inolvidable llena de innovación y tecnología!
            Asegura tu lugar y acompáñanos.
          </Text>
          <Button
            className="bg-red-600 text-white py-2 px-4 rounded-lg"
            href={inviteLink}
          >
            Confirmar Asistencia
          </Button>
          <Text className="text-md text-gray-500 mt-6">
            Si tienes alguna duda, no dudes en contactarnos. ¡Te esperamos!
          </Text>
          <Link
            href="https://mi-plataforma.com"
            className="text-blue-600 underline mt-4"
          >
            Visita nuestro sitio web
          </Link>
        </Container>
      </Body>
    </Html>
  )
}
