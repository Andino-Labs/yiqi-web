import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const REGION = process.env.AWS_REGION!
const FROM_EMAIL = process.env.FROM_EMAIL!
const client = new SESClient({ region: REGION })

if (!FROM_EMAIL) {
  throw new Error('missing FROM_EMAIL in env')
}

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS credentials missing in env')
}

export const emailClient = client

export async function sendEmail(
  to: string,
  subject: string,
  body: string,
  threadId: string
): Promise<void> {
  const params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: FROM_EMAIL,
    MessageAttributes: {
      'Andino-Thread-ID': {
        DataType: 'String',
        StringValue: threadId
      }
    }
  }

  try {
    const command = new SendEmailCommand(params)
    const response = await emailClient.send(command)
    console.log('Email sent successfully:', response)
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
