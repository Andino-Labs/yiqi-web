import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

const updateCommunicationSchema = z.object({
  userId: z.string(),
  stopCommunication: z.coerce.boolean()
})

export async function updateUserCommunicationPreference(formData: FormData) {
  const parsed = updateCommunicationSchema.parse({
    userId: formData.get('userId'),
    stopCommunication: !formData.get('stopCommunication')
  })

  await prisma.user.update({
    where: { id: parsed.userId },
    data: { stopCommunication: parsed.stopCommunication }
  })

  revalidatePath('/opt-out')
}
