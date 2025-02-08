import { z } from 'zod'

export enum InputTypes {
  TITLE = 'TITLE',
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  SELECT = 'SELECT'
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
export type InputTypesUnion = keyof typeof InputTypes
export type FormProps = z.infer<typeof FormFieldSchema>
export type ItemTypeProps = z.infer<typeof ItemTypePropsSchema>
export const FormStatus = z.enum(['draft', 'published', 'archived'])

export const BaseFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  fields: z.array(FormFieldSchema)
})
export const FormSchema = BaseFormSchema.extend({
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional()
})
export type FormModel = z.infer<typeof BaseFormSchema>
export const FormModelSchema = FormSchema.extend({
  organizationId: z.string()
})
export const FormModelSchemaSubmissions = FormFieldSchema.extend({})
export type FormModelResponse = z.infer<typeof FormSchema>
export type FormModelEditResponse = z.infer<typeof FormModelSchema>

export const FieldReponseSchemas = {
  [InputTypes.TEXT]: z
    .object({
      text: z.string().min(1, 'El texto es obligatorio'),
      question: z.string().min(1, 'La pregunta es requerida.'),
      id: z.string().min(1, 'El ID es requerido.')
    })
    .refine(data => data.id, 'El ID es requerido.'),
  [InputTypes.TEXTAREA]: z
    .object({
      text: z.string().min(1, 'Este campo es requerido.'),
      question: z.string().min(1, 'La pregunta es requerida.'),
      id: z.string().min(1, 'El ID es requerido.')
    })
    .refine(data => data.id, 'El ID es requerido.'),
  [InputTypes.RADIO]: z
    .object({
      id: z.string(),
      text: z.string().optional(),
      isEtc: z.boolean().optional(),
      question: z.string().min(1, 'La pregunta es requerida.')
    })
    .refine(data => data.id, 'Este campo es requerido.')
    .refine(data => {
      if (data.isEtc && (!data.text || !/\w+/.test(data.text.trim()))) {
        return false
      }
      return true
    }, 'Cuando isEtc es verdadero, el texto es requerido.'),
  [InputTypes.CHECKBOX]: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        checked: z.boolean(),
        question: z.string().min(1, 'La pregunta es requerida.')
      })
    )
    .refine(data => data.some(item => item.checked), {
      message: 'Debes seleccionar al menos una opción.'
    }),
  [InputTypes.SELECT]: z
    .object({
      id: z.string(),
      text: z.string(),
      question: z.string().min(1, 'La pregunta es requerida.')
    })
    .refine(data => data.id, 'Este campo es requerido.')
}
const SubmissionDataField = z.object({
  id: z.string(),
  inputType: z.nativeEnum(InputTypes),
  value: z
    .union([
      z.undefined(),
      FieldReponseSchemas[InputTypes.TEXT],
      FieldReponseSchemas[InputTypes.TEXTAREA],
      FieldReponseSchemas[InputTypes.RADIO],
      FieldReponseSchemas[InputTypes.CHECKBOX],
      FieldReponseSchemas[InputTypes.SELECT],
      z.array(z.never())
    ])
    .optional()
})
export const SubmissionSchemaResponse = z.array(
  z.object({
    submissionId: z.string(),
    userId: z.string(),
    userName: z.string(),
    userEmail: z.string().email(),
    data: z.array(SubmissionDataField),
    createdAt: z.string()
  })
)
export type FieldResponseKeys = keyof typeof FieldReponseSchemas
export type SubmissionDataFieldType = z.infer<typeof SubmissionDataField>
export type submissionResponse = z.infer<typeof SubmissionSchemaResponse>
