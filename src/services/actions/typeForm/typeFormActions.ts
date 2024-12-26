'use server'

import { generateUniqueId } from '@/components/yiqiForm/utils'
import { Form, FormModelSchema, FormSchema } from '@/schemas/yiqiFormSchema'
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

type FormFieldValue = string | boolean | { [key: string]: boolean } | null
type FormData = {
  id: string
  value?: FormFieldValue
}[]
export async function createFormSubmission(submissionData: {
  formId: string
  data: FormData
  eventId?: string | null
}) {
  try {
    const currentUser = await getUser()
    if (!currentUser) {
      throw new Error('Unauthorized: User not authenticated')
    }
    const { formId, data, eventId } = submissionData
    const newSubmission = await prisma.formSubmission.create({
      data: {
        formId,
        userId: currentUser.id,
        eventId,
        data
      }
    })
    return newSubmission
  } catch (error) {
    console.error('Error creating form submission:', error)
    throw new Error('Failed to create form submission')
  }
}

export async function getTypeForm(id: string) {
  try {
    const form = await prisma.form.findUnique({
      where: { id }
    })

    if (!form) {
      return {
        notFound: true
      }
    }

    const parsedForm = FormModelSchema.parse(form)

    return {
      success: true,
      form: parsedForm
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
