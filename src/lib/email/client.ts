import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY!

if (!RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY missing in env')
}

export const emailClient = new Resend(RESEND_API_KEY)

export async function sendEmail(
  to: string,
  subject: string,
  body: string,
  threadId: string,
  fromEmail: string
): Promise<void> {
  try {
    const response = await emailClient.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject,
      html: body,
      headers: {
        'Andino-Thread-ID': threadId
      }
    })

    console.log('Email sent successfully:', response)
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
