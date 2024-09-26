import { z } from "zod";

export const CustomFieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  type: z.enum(["text", "number", "select", "date"]),
  required: z.boolean(),
  options: z
    .string()
    .optional()
    .describe("Comma-separated list of options for select fields"),
});

export const EventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date",
  }),
  description: z.string().optional(),
  customFields: z.array(CustomFieldSchema),
  requiresApproval: z.boolean(),
});

export type EventInput = z.infer<typeof EventSchema>;
export type CustomFieldInput = z.infer<typeof CustomFieldSchema>;

export const createCustomFieldSchema = (field: CustomFieldInput) => {
  switch (field.type) {
    case "text":
      return z.string();
    case "number":
      return z.number();
    case "date":
      return z.date();
    case "select":
      return z.enum(
        field.options?.split(",").map((o) => o.trim()) as [string, ...string[]]
      );
    default:
      return z.string();
  }
};

export const createAttendeeSchema = (customFields: CustomFieldInput[]) => {
  const baseSchema = z.object({
    email: z.string().email("Invalid email address"),
  });

  const customFieldsSchema = z.object(
    customFields.reduce((acc, field) => {
      acc[field.name] = field.required
        ? createCustomFieldSchema(field)
        : createCustomFieldSchema(field).optional();
      return acc;
    }, {} as Record<string, z.ZodTypeAny>)
  );

  return baseSchema.merge(customFieldsSchema);
};
