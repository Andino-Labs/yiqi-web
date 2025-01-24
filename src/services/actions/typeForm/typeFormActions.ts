'use server'

import { generateUniqueIdYiqiForm } from '@/components/yiqiForm/utils'
import {
  Form,
  FormModelSchema,
  FormProps,
  FormSchema,
  SubmissionSchemaResponse
} from '@/schemas/yiqiFormSchema'
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
      id: formData.id || generateUniqueIdYiqiForm(),
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
    return {
      success: false,
      error: {
        type: 'UnexpectedError',
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'
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
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to create form submission'
    )
  }
}

export async function getFormById(id: string) {
  try {
    const form = await prisma.form.findUnique({
      where: { id }
    })

    if (!form) {
      return {
        success: false,
        error: {
          type: 'NotFound',
          message: 'Form not found'
        },
        form: null
      }
    }
    const parsedForm = FormModelSchema.parse({
      ...form,
      fields: form.fields ?? [],
      description: form.description ?? ''
    })

    const formFields: FormProps[] = parsedForm.fields.map(field => ({
      id: field.id,
      cardTitle: field.cardTitle,
      inputType: field.inputType,
      contents: field.contents,
      isFocused: field.isFocused,
      isRequired: field.isRequired
    }))

    return {
      success: true,
      form: { ...parsedForm, fields: formFields }
    }
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'UnexpectedError',
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'
      }
    }
  }
}
export async function getResultFormById(idForm: string) {
  try {
    const currentUser = await getUser()
    if (!currentUser) {
      throw new Error('Unauthorized: User not authenticated')
    }
    const form = await prisma.form.findUnique({
      where: {
        id: idForm
      },
      include: {
        submissions: {
          include: {
            user: true
          }
        }
      }
    })
    if (!form) {
      return {
        success: false,
        error: {
          type: 'NotFound',
          message: 'Form not found'
        }
      }
    }
    const formattedSubmissions = form.submissions.map(submission => ({
      submissionId: submission.id,
      userId: submission.userId,
      userName: submission.user?.name,
      userEmail: submission.user?.email,
      data: submission.data || [],
      createdAt: submission.createdAt.toISOString()
    }))
    const submissions = SubmissionSchemaResponse.parse(formattedSubmissions)
    console.log(submissions)
    return {
      success: true,
      submissions
    }
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'UnexpectedError',
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while fetching form results'
      }
    }
  }
}
export async function getForms(orgId: string) {
  try {
    const forms = await prisma.form.findMany({
      where: {
        organizationId: orgId
      },
      select: {
        id: true,
        name: true,
        description: true,
        submissions: {
          select: {
            id: true
          }
        }
      }
    })
    const formattedForms = forms.map(form => ({
      id: form.id,
      name: form.name,
      description: form.description ?? 'No description',
      totalSubmissions: form.submissions.length
    }))

    return {
      success: true,
      forms: formattedForms
    }
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'UnexpectedError',
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while fetching forms'
      }
    }
  }
}

export async function deleteForm(formId: string) {
  try {
    const userCurrent = await getUser()
    if (!userCurrent?.id) return { success: false, error: 'User not found' }

    const form = await prisma.form.findUnique({ where: { id: formId } })
    if (!form) throw new Error('Form not found')

    await prisma.formSubmission.deleteMany({
      where: { formId }
    })

    await prisma.form.delete({
      where: { id: formId }
    })

    return { success: true, message: 'Form deleted successfully' }
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'UnexpectedError',
        message:
          error instanceof Error ? error.message : 'Failed to delete form'
      }
    }
  }
}
