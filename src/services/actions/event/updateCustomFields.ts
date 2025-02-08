'use server'
import prisma from '@/lib/prisma'
import { deepMerge } from '@/lib/deepMerge'

export type JsonValue =
  | JsonObject
  | JsonArray
  | string
  | number
  | boolean
  | null
export type JsonObject = { [key: string]: JsonValue }
export type JsonArray = JsonValue[]

export type CustomField = {
  name: string
  description: string
  type: 'number' | 'boolean' | 'date' | 'text' | 'url'
  inputType: 'shortText' | 'longText'
  required?: boolean
  defaultValue?: string | number | boolean
}

export async function updateCustomFields(
  eventId: string,
  customFields: CustomField[]
): Promise<void> {
  // Fetch the existing customFields from the database
  const oldRecord = await prisma.event.findUnique({
    where: { id: eventId },
    select: { customFields: true }
  })

  // Parse the existing customFields if it's a string
  const existingCustomFields =
    oldRecord && oldRecord.customFields
      ? typeof oldRecord.customFields === 'string'
        ? JSON.parse(oldRecord.customFields)
        : oldRecord.customFields
      : {}

  // Merge the existing customFields with the new fields array
  const mergedCustomFields = deepMerge(existingCustomFields, {
    fields: customFields
  })

  // Update the event with the merged custom fields
  await prisma.event.update({
    where: { id: eventId },
    data: { customFields: mergedCustomFields }
  })
}
