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
export interface EventAttendanceConfirmedProps {
  user: User
  event: Event
}

export function EventAttendanceConfirmed({
  user,
  event
}: EventAttendanceConfirmedProps): ReactElement {
  const { name } = user
  const { title: eventName, startDate, endDate, location, id } = event

  // Placeholder for dynamic event link, replace with actual link
  const eventLink = `https://mi-plataforma.com/evento/${id}`

  return (
    <Html>
      <Head />
      <Preview>¡Asistencia confirmada para {eventName}!</Preview>
      <Body className="bg-gray-100">
        <Container className="mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
          <Heading className="text-2xl font-bold text-center text-gray-800 mb-4">
            ¡Tu asistencia está confirmada, {name}!
          </Heading>
          <Text className="text-lg text-gray-600 mb-4">
            Estamos encantados de confirmar tu asistencia al evento{' '}
            <strong>{eventName}</strong>, que se llevará a cabo desde el{' '}
            <strong>{new Date(startDate).toLocaleDateString()}</strong> hasta el{' '}
            <strong>{new Date(endDate).toLocaleDateString()}</strong> en{' '}
            <strong>{location}</strong>.
          </Text>
          <Img
            src="https://via.placeholder.com/600x300"
            alt="Imagen del evento"
            className="w-full mb-6 rounded-lg"
          />
          <Text className="text-lg text-gray-600 mb-4">
            ¡Nos alegra que formes parte de esta experiencia! Prepárate para una
            jornada emocionante llena de innovación y tecnología.
          </Text>
          <Button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg"
            href={eventLink}
          >
            Ver Detalles del Evento
          </Button>
          <Text className="text-lg text-gray-600 mt-6">
            Si tienes alguna pregunta o necesitas más información antes del
            evento, no dudes en contactarnos. ¡Nos vemos pronto en {eventName}!
          </Text>
          <Link
            href="https://mi-plataforma.com"
            className="text-blue-600 underline mt-4"
          >
            Visitar nuestra página
          </Link>
        </Container>
      </Body>
    </Html>
  )
}
