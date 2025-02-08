import { ReactElement } from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link
} from '@react-email/components'

// Define the props types for each template
export interface BaseEmailTemplateProps {
  content: string
}

export function BaseEmailTemplate({
  content
}: BaseEmailTemplateProps): ReactElement {
  // Placeholder for dynamic link, replace with actual link

  return (
    <Html>
      <Head />

      <Body className="bg-gray-100">
        <Container className="mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
          <div dangerouslySetInnerHTML={{ __html: content }} />

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
