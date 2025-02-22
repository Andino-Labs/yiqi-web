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
  Link
} from '@react-email/components'

// Define the props types for each template
export interface EventRegistrationRejectedProps {
  user: User
  event: Event
}

export function EventRegistrationRejected({
  user,
  event
}: EventRegistrationRejectedProps): ReactElement {
  const { name } = user
  const { title: eventName, startDate, endDate, location } = event

  // Placeholder for the event link, replace with the actual event link if needed
  const eventLink = `https://yiqi.lat/events`

  return (
    <Html>
      <Head />
      <Preview>
        Lo sentimos, tu registro para {eventName} no fue aceptado
      </Preview>
      <Body className="bg-gray-100">
        <Container className="mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
          <Heading className="text-2xl font-bold text-center text-gray-800 mb-4">
            Hola, {name}
          </Heading>
          <Text className="text-lg text-gray-600 mb-4">
            Lamentamos informarte que tu solicitud de registro para el evento{' '}
            <strong>{eventName}</strong>, programado desde el{' '}
            <strong>{new Date(startDate).toLocaleDateString()}</strong> hasta el{' '}
            <strong>{new Date(endDate).toLocaleDateString()}</strong> en{' '}
            <strong>{location}</strong>, no ha sido aceptada.
          </Text>
          <Text className="text-lg text-gray-600 mb-4">
            Debido a una gran demanda o criterios específicos, no hemos podido
            confirmar tu asistencia en esta ocasión. Sin embargo, esperamos que
            puedas acompañarnos en futuros eventos.
          </Text>
          <Button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg"
            href={eventLink}
          >
            Ver otros eventos
          </Button>
          <Text className="text-lg text-gray-600 mt-6">
            Si tienes alguna pregunta o necesitas más información, no dudes en
            contactarnos. ¡Gracias por tu interés en {eventName}!
          </Text>
          <Link
            href="https://mi-plataforma.com"
            className="text-blue-600 underline mt-4"
          >
            Visita nuestra página web
          </Link>
        </Container>
      </Body>
    </Html>
  )
}
