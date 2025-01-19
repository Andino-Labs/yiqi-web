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
  Section,
  Row,
  Column,
  Hr,
  Img
} from '@react-email/components'
import { BASE_URL } from '@/lib/env'

export interface InvoiceItem {
  description: string
  amount: number
}

export interface InvoiceEmailTemplateProps {
  user: {
    id: string
    name: string
    email: string
  }
  event: {
    id: string
    title: string
    startDate: Date
    endDate: Date
  }
  amount: number
  invoiceNumber: string
  items: InvoiceItem[]
}

export function InvoiceEmailTemplate({
  user,
  event,
  amount,
  invoiceNumber,
  items
}: InvoiceEmailTemplateProps): ReactElement {
  const { name } = user
  const { title: eventName, id } = event

  const eventLink: string = `${BASE_URL}/${id}`
  const tickets: string = `${BASE_URL}/user/tickets`
  const logoUrl: string =
    'https://andinoweb.s3.us-east-1.amazonaws.com/logo_yiqi_+1.png'

  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'PEN'
    }).format(value)
  }

  return (
    <Html>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=swap');
          
          body {
            font-family: 'Space Grotesk', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          @media (prefers-color-scheme: dark) {
            .email-body { background-color: #000000 !important; }
            .email-container { background-color: #111111 !important; border-color: #222222 !important; }
            .email-text { color: #ffffff !important; }
            .email-subtext { color: #888888 !important; }
            .email-heading { color: #ffffff !important; }
            .email-button { border-color: #ffffff !important; color: #ffffff !important; }
            .email-button-primary { background-color: #ffffff !important; color: #000000 !important; }
            .email-hr { border-color: #222222 !important; }
            .email-invoice-details { background-color: #1a1a1a !important; border-color: #222222 !important; }
          }

          @media only screen and (max-width: 600px) {
            .email-container { padding: 32px 24px !important; }
            .email-button-wrapper { display: block !important; }
            .email-button-wrapper td { display: block !important; width: 100% !important; padding: 0 0 16px 0 !important; }
            .email-button { width: 100% !important; }
          }
        `}</style>
      </Head>
      <Preview>
        Factura pagada por {formatCurrency(amount)} para {eventName}
      </Preview>
      <Body style={main} className="email-body">
        <Container style={container} className="email-container">
          <Section style={logoSection}>
            <Img
              src={logoUrl}
              alt="Logo"
              width="80"
              height="auto"
              style={logo}
            />
          </Section>

          <Section style={confirmationSection}>
            <Heading style={h1} className="email-heading">
              Pago confirmado, {name}
            </Heading>
            <Text style={subtitle} className="email-subtext">
              Gracias por tu pago. Aquí están los detalles de tu factura:
            </Text>
          </Section>

          <Section style={invoiceDetails} className="email-invoice-details">
            <Heading as="h2" style={h2} className="email-heading">
              Detalles de la factura
            </Heading>
            <div style={detailsGrid}>
              <div style={detailItem}>
                <Text style={detailLabel} className="email-subtext">
                  Número de factura
                </Text>
                <Text style={detailValue} className="email-text">
                  {invoiceNumber}
                </Text>
              </div>
              <div style={detailItem}>
                <Text style={detailLabel} className="email-subtext">
                  Fecha de pago
                </Text>
                <Text style={detailValue} className="email-text">
                  {formatDate(new Date())}
                </Text>
              </div>
              <div style={detailItem}>
                <Text style={detailLabel} className="email-subtext">
                  Monto total
                </Text>
                <Text style={detailValue} className="email-text">
                  {formatCurrency(amount)}
                </Text>
              </div>
            </div>
          </Section>

          <Section style={itemsSection}>
            <Heading as="h3" style={h3} className="email-heading">
              Artículos facturados
            </Heading>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column>
                  <Text style={itemDescription} className="email-text">
                    {item.description}
                  </Text>
                </Column>
                <Column>
                  <Text style={itemAmount} className="email-text">
                    {formatCurrency(item.amount)}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Section style={ctaSection}>
            <Row className="email-button-wrapper">
              <Column style={ctaColumn}>
                <Button
                  style={primaryButton}
                  href={tickets}
                  className="email-button email-button-primary"
                >
                  Ver Mis Entradas
                </Button>
              </Column>
              <Column style={ctaColumn}>
                <Button
                  style={secondaryButton}
                  href={eventLink}
                  className="email-button"
                >
                  Detalles del Evento
                </Button>
              </Column>
            </Row>
          </Section>

          <Text style={text} className="email-text">
            ¡Gracias por tu compra! Esperamos que disfrutes del evento.
          </Text>

          <Text style={text} className="email-subtext">
            Si tienes alguna pregunta sobre tu factura o necesitas más
            información, no dudes en contactarnos.
          </Text>

          <Hr style={hr} className="email-hr" />

          <Link href={`${BASE_URL}`} style={link} className="email-text">
            Visitar nuestra página
          </Link>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    'Space Grotesk, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
}

const container = {
  margin: '40px auto',
  padding: '48px 32px',
  width: '100%',
  maxWidth: '560px',
  border: '1px solid #eaeaea',
  borderRadius: '16px'
}

const logoSection = {
  marginBottom: '40px'
}

const logo = {
  margin: '0 auto',
  display: 'block'
}

const confirmationSection = {
  textAlign: 'center' as const,
  marginBottom: '40px'
}

const h1 = {
  color: '#000000',
  fontSize: '24px',
  fontWeight: '500',
  lineHeight: '1.3',
  margin: '0 0 12px',
  padding: '0'
}

const subtitle = {
  color: '#666666',
  fontSize: '16px',
  margin: '0',
  padding: '0'
}

const invoiceDetails = {
  padding: '32px',
  border: '1px solid #eaeaea',
  borderRadius: '12px',
  marginBottom: '32px'
}

const h2 = {
  color: '#000000',
  fontSize: '20px',
  fontWeight: '500',
  lineHeight: '1.35',
  margin: '0 0 24px',
  padding: '0'
}

const h3 = {
  color: '#000000',
  fontSize: '18px',
  fontWeight: '500',
  lineHeight: '1.35',
  margin: '0 0 16px',
  padding: '0'
}

const detailsGrid = {
  display: 'grid' as const,
  gap: '24px'
}

const detailItem = {
  display: 'grid' as const,
  gap: '4px'
}

const detailLabel = {
  color: '#666666',
  fontSize: '14px',
  margin: '0',
  padding: '0'
}

const detailValue = {
  color: '#000000',
  fontSize: '16px',
  margin: '0',
  padding: '0'
}

const itemsSection = {
  marginBottom: '32px'
}

const itemRow = {
  marginBottom: '16px'
}

const itemDescription = {
  color: '#000000',
  fontSize: '16px',
  margin: '0',
  padding: '0'
}

const itemAmount = {
  color: '#000000',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0',
  padding: '0',
  textAlign: 'right' as const
}

const ctaSection = {
  marginBottom: '32px'
}

const ctaColumn = {
  padding: '0 8px'
}

const buttonBase = {
  padding: '12px 24px',
  border: '1px solid #000000',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '500',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  minWidth: '160px'
}

const primaryButton = {
  ...buttonBase,
  backgroundColor: '#000000',
  color: '#ffffff'
}

const secondaryButton = {
  ...buttonBase,
  backgroundColor: 'transparent',
  color: '#000000'
}

const text = {
  color: '#000000',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0 0 24px'
}

const hr = {
  border: 'none',
  borderTop: '1px solid #eaeaea',
  margin: '32px 0'
}

const link = {
  color: '#000000',
  fontSize: '14px',
  textDecoration: 'none',
  display: 'block',
  textAlign: 'center' as const
}

export default InvoiceEmailTemplate
