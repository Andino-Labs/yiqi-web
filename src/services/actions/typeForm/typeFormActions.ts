'use server'

import { generateUniqueId } from '@/components/yiqiForm/utils'
import { Form, FormSchema } from '@/schemas/yiqiFormSchema'
import { getUser } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'

export async function createTypeForm(orgId: string, formData: Form) {
  try {
    const currentUser = await getUser()
    if (!currentUser) {
      throw new Error('Unauthorized: User not authenticated')
    }
    const validatedForm = FormSchema.parse({
      ...formData,
      id: formData.id || generateUniqueId(),
      organizationId: orgId
    })
    const createdForm = await prisma.form.create({
      data: {
        id: validatedForm.id,
        organizationId: orgId,
        eventId: validatedForm.eventId ?? null,
        name: validatedForm.name,
        description: validatedForm.description ?? null,
        fields: validatedForm.fields, // Prisma uses Json type
        createdAt: validatedForm.createdAt,
        updatedAt: validatedForm.updatedAt,
        deletedAt: validatedForm.deletedAt || null
      }
    })
    return {
      success: true,
      form: {
        id: createdForm.id,
        name: createdForm.name
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: {
        type: 'UnexpectedError',
        message: 'An unexpected error occurred'
      }
    }
  }
}
