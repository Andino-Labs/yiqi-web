'use server'

import { redirect } from 'next/navigation'
import { getUser } from './lucia'
import { headers } from 'next/headers'
import { getUserProfile } from '@/services/actions/userActions'

export async function getUserOrRedirect() {
  const userCurrent = await getUser()
  const headersList = headers()

  const fullUrl = headersList.get('x-full-url')

  if (!fullUrl) {
    throw new Error('no fullUrl')
  }

  const currentPath = new URL(fullUrl).pathname

  const queryParams = new URLSearchParams({ redirect: currentPath }).toString()

  if (!userCurrent?.id) {
    redirect(`/auth-passthru?${queryParams}`)
  }

  const user = await getUserProfile(userCurrent.id)

  if (!user) {
    redirect(`/auth-passthru?${queryParams}`)
  }

  return { userCurrent, user }
}
