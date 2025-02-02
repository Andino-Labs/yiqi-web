'use server'

import prisma from '@/lib/prisma'
import { CustomFieldsSchema } from '@/schemas/eventSchema'

export type GetEventCustomFieldsResponse = {
  success: boolean
  data?: Record<string, unknown>[]
  error?: string
}

export async function getEventCustomFields(
  eventId: string
): Promise<GetEventCustomFieldsResponse> {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { customFields: true }
    })

    if (!event) {
      return { success: false, error: 'Event not found' }
    }

    const parsedFields = CustomFieldsSchema.safeParse(event.customFields)

    if (!parsedFields.success) {
      return {
        success: false,
        error: 'Invalid custom fields format',
        data: []
      }
    }

    return {
      success: true,
      data: parsedFields.data.eventData || []
    }
  } catch (error) {
    console.error('Error fetching event custom fields:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: []
    }
  }
}
