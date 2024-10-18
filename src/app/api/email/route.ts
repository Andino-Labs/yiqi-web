import { handleEmailReceived } from '@/lib/email/handlers/handleEmailReceived'
import simplerParser from 'mailparser'
import { NextRequest, NextResponse } from 'next/server'

//
export async function POST(req: NextRequest) {
  const body = await req.json()

  try {
    const email = await simplerParser.simpleParser(body)

    // Access custom headers
    const threadId = email.headers.get('andino-thread-id')

    if (!threadId) {
      throw 'no thread id found'
    }

    const parsedBody = email.html || email.text
    if (typeof parsedBody != 'string') {
      throw ' no body'
    }

    await handleEmailReceived({
      threadId: threadId.toString(),
      content: parsedBody
      // attachments: email.attachments[0].content.toString(),
    })
  } catch (e) {
    console.error(e)
  }
  return new NextResponse(null, { status: 200 })
}
