import { CreateEmailOptions, Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY!

export async function sendEmail({
  to,
  subject,
  body,
  threadId,
  fromEmail,
  attachments
}: {
  to: string
  subject: string
  body: string
  threadId: string
  fromEmail: string
  attachments?: CreateEmailOptions['attachments']
}): Promise<void> {
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY missing in env')
  }

  const emailClient = new Resend(RESEND_API_KEY)
  try {
    const response = await emailClient.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject,
      html: body,
      headers: {
        'Andino-Thread-ID': threadId
      },
      attachments
    })

    console.log('Email sent successfully:', response)
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
