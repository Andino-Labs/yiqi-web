import { z } from 'zod'
import { MessageThreadTypeEnum } from './messagesSchema'

export const SendUserMessageJobSchema = z.object({
  userId: z.string(),
  content: z.string(),
  messageType: MessageThreadTypeEnum,
  orgId: z.string()
})

export type SendUserMessageJobType = z.infer<typeof SendUserMessageJobSchema>

export const QueueJobTypeEnum = z.enum([
  'COLLECT_USER_DATA',
  'GENERATE_EVENT_OPEN_GRAPH',
  'SEND_USER_MESSAGE'
])

export const QueueJobStatusEnum = z.enum([
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED'
])

export type QueueJobType = z.infer<typeof QueueJobTypeEnum>
export type QueueJobStatus = z.infer<typeof QueueJobStatusEnum>
