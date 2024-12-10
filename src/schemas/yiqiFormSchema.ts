import { z } from 'zod'

export enum InputTypes {
  TITLE = 'TITLE',
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  SELECT = 'SELECT',
  EMAIL = 'email',
  PHONENUMBER = 'phoneNumber',
  ADDRESS = 'address',
  WEBSITE = 'website',
  VIDEO = 'video',
  MULTIPLECHOICE = 'multipleChoice',
  DROPDOWN = 'dropdown',
  PICTURECHOICE = 'pictureChoice',
  YESNO = 'yesNo',
  DATE = 'date',
  NUMBER = 'number',
  RATING = 'rating',
  FILEUPLOAD = 'fileUpload'
}
const ItemTypePropsSchema = z.object({
  id: z.string(),
  text: z.string().optional(),
  isEtc: z.boolean().optional()
})

export const FormFieldSchema = z.object({
  id: z.string(),
  cardTitle: z.string(),
  inputType: z.nativeEnum(InputTypes),
  contents: z.union([z.string(), z.array(ItemTypePropsSchema)]),
  isFocused: z.boolean(),
  isRequired: z.boolean()
})
export type FormProps = z.infer<typeof FormFieldSchema>
export type ItemTypeProps = z.infer<typeof ItemTypePropsSchema>
export const FormStatus = z.enum(['draft', 'published', 'archived'])
// Schema for Thank You Page Settings
const ThankYouPageSchema = z.object({
  message: z.string(),
  redirectUrl: z.string().optional()
})

// Schema for Form Settings
const FormSettingsSchema = z.object({
  allowMultipleSubmissions: z.boolean().optional(),
  showProgressBar: z.boolean().optional(),
  requiredErrorMessage: z.string().optional(),
  thankYouPage: ThankYouPageSchema.optional()
})

// Form Schema
export const FormSchema = z.object({
  id: z.string(),
  eventId: z.string().nullable().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),
  fields: z.array(FormFieldSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
  // status: FormStatus,
  settings: FormSettingsSchema.optional()
})

// FormModel Schema (extending Form with organizationId)
export const FormModelSchema = FormSchema.extend({
  organizationId: z.string()
})

// Type inference
export type Form = z.infer<typeof FormSchema>
export type FormModel = z.infer<typeof FormModelSchema>
