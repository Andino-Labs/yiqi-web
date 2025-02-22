import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const redirectPath = searchParams.get('redirect')

  console.log('redirectPath', redirectPath)

  if (!redirectPath) {
    throw new Error('no redirect path')
  }

  await cookies().set('redirect', redirectPath)

  return redirect('/auth')
}
