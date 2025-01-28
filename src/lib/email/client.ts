import { CreateEmailOptions, Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY!

// Rate limiter implementation
class RateLimiter {
  private tokens: number
  private lastRefill: number
  private readonly maxTokens: number
  private readonly refillRate: number // tokens per millisecond

  constructor(maxRequestsPerSecond: number) {
    this.maxTokens = maxRequestsPerSecond
    this.tokens = maxRequestsPerSecond
    this.lastRefill = Date.now()
    this.refillRate = maxRequestsPerSecond / 1000 // Convert to tokens per millisecond
  }

  async waitForToken(): Promise<void> {
    this.refillTokens()

    if (this.tokens < 1) {
      const waitTime = Math.ceil((1 - this.tokens) / this.refillRate)
      await new Promise(resolve => setTimeout(resolve, waitTime))
      this.refillTokens()
    }

    this.tokens -= 1
  }

  private refillTokens(): void {
    const now = Date.now()
    const timePassed = now - this.lastRefill
    this.tokens = Math.min(
      this.maxTokens,
      this.tokens + timePassed * this.refillRate
    )
    this.lastRefill = now
  }
}

// Create a rate limiter instance with 2 requests per second
const rateLimiter = new RateLimiter(2)

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
    // Wait for rate limiter before sending
    await rateLimiter.waitForToken()

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

    if (response.error) {
      console.error('Error sending email:', response.error)
      throw response.error
    }

    console.log('Email sent successfully:', response)
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
