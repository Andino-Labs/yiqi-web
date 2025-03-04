import { z } from 'zod'

export const createPostTwitterSchema = z.object({
  userId: z.string(),
  accountId: z.string(),
  organizationId: z.string(),
  content: z.string(),
  scheduledDate: z.date(),
  status: z.enum(['SCHEDULED', 'PUBLISHED']).optional(),
  postTwitterId: z.string().optional()
})

export const updatePostTwitterSchema = z.object({
  postId: z.number(),
  content: z.string(),
  scheduledDate: z.date(),
  status: z.enum(['SCHEDULED', 'PUBLISHED']).optional(),
  userId: z.string(),
  organizationId: z.string()
})

export const addTwitterAccount = z.object({
  userIdApp: z.string(),
  userId: z.string(),
  screenName: z.string(),
  accountId: z.string(),
  accessToken: z.string(),
  accessTokenSecret: z.string(),
  organizationId: z.string()
})

export const dataTwitterSchema = z
  .object({
    userId: z.string(),
    accountUsername: z.string(),
    accountId: z.string(),
    organizationId: z.string()
  })
  .nullable()

export const postTwitterSchema = z.object({
  userId: z.string(),
  accountId: z.string(),
  organizationId: z.string(),
  content: z.string(),
  scheduledDate: z.date(),
  status: z.enum(['SCHEDULED', 'PUBLISHED']),
  postTwitterId: z.string(),
  id: z.number()
})

export type CreatePostTwitterSchema = z.infer<typeof createPostTwitterSchema>
export type UpdatePostTwitterSchema = z.infer<typeof updatePostTwitterSchema>
export type AddTwitterAccountSchema = z.infer<typeof addTwitterAccount>
export type DataTwitterSchema = z.infer<typeof dataTwitterSchema>
export type PostTwitterSchema = z.infer<typeof postTwitterSchema>
