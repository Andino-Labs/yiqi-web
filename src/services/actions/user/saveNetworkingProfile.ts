'use server'

import { getUser } from '@/lib/auth/lucia'
import { updateNetworkingProfile } from '@/lib/user/updateNetworkingProfile'
import { userDataCollectedShema } from '@/schemas/userSchema'

export async function saveNetworkingProfile(formData: FormData) {
  const user = await getUser()
  if (!user) {
    return { error: 'Not authenticated', success: false }
  }

  return updateNetworkingProfile(
    user.id,
    userDataCollectedShema.parse(formData)
  )
}
