import { z } from 'zod'

export const GenerateEventOpenGraphJobSchema = z.object({
  eventId: z.string()
})

export type GenerateEventOpenGraphJobData = z.infer<
  typeof GenerateEventOpenGraphJobSchema
>
