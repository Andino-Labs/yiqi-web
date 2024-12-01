'use server'

import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'
import { OrgMessageListItemSchema } from '@/schemas/messagesSchema'

export async function getOrganizationMessageThreads(orgId: string) {
  const currentUser = await getUser()
  if (!currentUser) throw new Error('Unauthorized')

  const isAllowed = await isOrganizerAdmin(orgId, currentUser.id)

  if (!isAllowed) {
    throw new Error('Unauthorized: no access to event or organization')
  }

  const messageThreads = await prisma.messageThread.findMany({
    where: {
      organizationId: orgId
    },
    orderBy: {
      updatedAt: 'desc'
    },
    take: 100,
    distinct: ['contextUserId'],
    include: {
      contextUser: true,
      messages: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }
    }
  })

  //   id: z.string(),
  //   type: z.enum(['whatsapp', 'email']),
  //   organizationId: z.string(),
  //   contextUserId: z.string(),
  //   userId: z.string().nullable(),
  //   contextUserName: z.string().nullable(),
  //   contextUserEmail: z.string().nullable(),
  //   contextUserPicture: z.string().nullable(),
  //   lastMessage: z.object({
  //     id: z.string(),
  //     content: z.string(),
  //     createdAt: z.string(),
  //     senderUserId: z.string()
  //   })
  return messageThreads.map(thread =>
    OrgMessageListItemSchema.parse({
      id: thread.id,
      type: thread.type,
      organizationId: thread.organizationId,
      contextUserId: thread.contextUserId,
      contextUserName: thread.contextUser.name,
      contextUserEmail: thread.contextUser.email,
      contextUserPicture: thread.contextUser.picture,
      lastMessage: thread.messages[0]
        ? {
            id: thread.messages[0].id,
            content: thread.messages[0].content,
            createdAt: thread.messages[0].createdAt,
            senderUserId: thread.messages[0].senderUserId
          }
        : null
    })
  )
}
