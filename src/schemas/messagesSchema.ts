import { z } from 'zod'

const UserInfoSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  picture: z.string().nullable()
})

export const MessageThreadTypeEnum = z.enum(['whatsapp', 'email'])
export type MessageThreadType = z.infer<typeof MessageThreadTypeEnum>
export const MessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  attachement: z.string().nullable(),
  createdAt: z.date(),
  senderUserId: z.string().nullable(),
  destinationUserId: z.string().nullable(),
  senderUser: UserInfoSchema.nullable(),
  destinationUser: UserInfoSchema.nullable(),
  messageThread: z.object({
    type: MessageThreadTypeEnum,
    id: z.string()
  })
})

export const MessageListSchema = z.array(MessageSchema)

export type Message = z.infer<typeof MessageSchema>
export type MessageList = z.infer<typeof MessageListSchema>

export const OrgMessageListItemSchema = z.object({
  id: z.string(),
  type: z.enum(['whatsapp', 'email']),
  organizationId: z.string(),
  contextUserId: z.string(),
  contextUserName: z.string().nullable(),
  contextUserEmail: z.string().nullable(),
  contextUserPicture: z.string().nullable(),
  lastMessage: z
    .object({
      id: z.string(),
      content: z.string(),
      createdAt: z.string(),
      senderUserId: z.string().nullable()
    })
    .nullable()
})

export type OrgMessageListItemSchemaType = z.infer<
  typeof OrgMessageListItemSchema
>
