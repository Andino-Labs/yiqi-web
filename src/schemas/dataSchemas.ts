import { z } from 'zod'

export const registrationStatsSchema = z.object({
  date: z.string(),
  count: z.number()
})

export type RegistrationStats = z.infer<typeof registrationStatsSchema>
