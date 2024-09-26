import { z } from "zod";

export const EventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date",
  }),
  description: z.string().optional(),
});

export type EventInput = z.infer<typeof EventSchema>;
