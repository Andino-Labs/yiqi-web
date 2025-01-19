'use server'

import { getUser } from '@/lib/auth/lucia'
import { type RegistrationInput } from '@/schemas/eventSchema'
import { createRegistration as createRegistrationFn } from '@/lib/event/createRegistration'
import { revalidatePath } from 'next/cache'

export async function createRegistration(
  eventId: string,
  registrationData: RegistrationInput
) {
  const signedInUser = await getUser()
  try {
    return await createRegistrationFn(signedInUser, eventId, registrationData)
  } catch (error) {
    throw new Error(`${error}`)
  } finally {
    revalidatePath('/', 'layout')
  }
}
