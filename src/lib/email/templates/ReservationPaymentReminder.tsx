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
export interface ReservationPaymentReminderProps {
  user: User
  event: Event
}

export function ReservationPaymentReminder({
  user,
  event
}: ReservationPaymentReminderProps): ReactElement {
  const { name } = user
  const { title: eventName, startDate, endDate, location, id } = event

  // Placeholder for dynamic payment link, replace with actual payment link
  const paymentLink = `https://mi-plataforma.com/evento/${id}/pago`

  return (
    <Html>
      <Head />
      <Preview>Recuerda completar el pago para {eventName}</Preview>
      <Body className="bg-gray-100">
        <Container className="mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
          <Heading className="text-2xl font-bold text-center text-gray-800 mb-4">
            ¡Hola, {name}!
          </Heading>
          <Text className="text-lg text-gray-600 mb-4">
            Te queremos recordar que ya estás registrado para el evento{' '}
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
            Para asegurar tu lugar y disfrutar de esta experiencia inolvidable,
            te invitamos a completar tu pago lo antes posible.
          </Text>
          <Button
            className="bg-red-600 text-white py-2 px-4 rounded-lg"
            href={paymentLink}
          >
            Completar Pago
          </Button>
          <Text className="text-lg text-gray-600 mt-6">
            Si tienes alguna duda sobre el proceso, no dudes en contactarnos.
            ¡Estamos aquí para ayudarte y esperamos verte en el evento!
          </Text>
          <Link
            href="https://mi-plataforma.com"
            className="text-blue-600 underline mt-4"
          >
            Más información sobre el evento
          </Link>
        </Container>
      </Body>
    </Html>
  )
}
