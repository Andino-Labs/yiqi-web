'use server'

// TODO: Handle the checkout return
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return new Response('No session id', { status: 400 })
  }

  return new Response('OK')
}
