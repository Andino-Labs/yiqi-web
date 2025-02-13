import simplerParser from 'mailparser'
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand
} from '@aws-sdk/client-sqs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { handleEmailReceived } from '@/lib/email/handlers/handleEmailReceived'
import prisma from '@/lib/prisma'
const sqsClient = new SQSClient({ region: 'us-east-1' })
const queueUrl = process.env.AWS_SQS_QUEUE_URL
export const dynamic = 'force-dynamic'

const EmailNotificationSchema = z.object({
  notificationType: z.string(),
  mail: z.object({
    source: z.string(),
    destination: z.array(z.string()),
    subject: z.string().optional(),
    commonHeaders: z.object({
      subject: z.string(),
      from: z.array(z.string()),
      to: z.array(z.string())
    })
  }),
  content: z.string()
})

export async function GET() {
  const receiveParams = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 10
  }
  const receiveCommand = new ReceiveMessageCommand(receiveParams)
  const response = await sqsClient.send(receiveCommand)

  try {
    // Receive a message from the SQS queue

    if (!response.Messages || response.Messages.length === 0) {
      return new NextResponse(null, { status: 204 })
    }

    const message = response.Messages[0]
    if (!message.Body) {
      throw new Error('No body in email message')
    }

    // Parse the SNS message
    const snsMessage = JSON.parse(message.Body)

    // Parse the actual email notification
    const emailNotificationRaw = JSON.parse(snsMessage.Message)
    const emailNotification =
      EmailNotificationSchema.parse(emailNotificationRaw)

    // Extract key details
    const fromEmail = emailNotification.mail.source
    const toEmail = emailNotification.mail.destination.find(v =>
      v.includes('@yiqi.lat')
    )
    const subject = emailNotification.mail.commonHeaders.subject

    if (!toEmail) {
      throw new Error('could not determine where to route the email')
    }
    // Decode base64 content
    const decodedContent = Buffer.from(
      emailNotification.content,
      'base64'
    ).toString()

    // Parse the email content
    const email = await simplerParser.simpleParser(decodedContent)
    const parsedBody = email.html || email.text

    if (typeof parsedBody !== 'string') {
      throw new Error('No body found in email')
    }

    const fromUser = await prisma.user.findFirst({
      where: {
        email: { equals: fromEmail, mode: 'insensitive' }
      }
    })

    // only process emails if the user exists, if not just discard because they shouldnt be emailing us.
    if (fromUser) {
      // Handle the email with all required fields
      await handleEmailReceived({
        fromEmail,
        toEmail,
        content: parsedBody,
        subject
      })
    }

    // Delete the message from the queue after processing
    const deleteParams = {
      QueueUrl: queueUrl,
      ReceiptHandle: message.ReceiptHandle
    }

    const deleteCommand = new DeleteMessageCommand(deleteParams)
    await sqsClient.send(deleteCommand)

    return new NextResponse(null, { status: 200 })
  } catch (e) {
    console.error(e)
    console.log(response)
    return new NextResponse(null, { status: 500 })
  }
}
