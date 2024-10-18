import { z } from 'zod'

// inputs and output must always be zod based so that we can export
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.date().nullable(),
  picture: z.string().nullable(),
  phoneNumber: z.string().nullable()
})
