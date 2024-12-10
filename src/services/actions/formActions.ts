'use server'

import prisma from '@/lib/prisma'
import { InputJsonValue } from '@prisma/client/runtime/library'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'

const FormSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  fields: z.array(
    z.object({
      name: z.string(),
      type: z.enum(['text', 'number', 'date', 'checkbox', 'radio', 'select']),
      options: z.array(z.string()).optional(),
      required: z.boolean()
    })
  )
})

const FormSubmissionSchema = z.object({
  data: z.record(z.unknown())
})

export async function createForm(
  organizationId: string,
  eventId: string | null,
  formData: unknown
) {
  const currentUser = await getUser()
  if (
    !currentUser ||
    !(await isOrganizerAdmin(organizationId, currentUser.id))
  ) {
    throw new Error('Unauthorized')
  }

  const validatedData = FormSchema.parse(formData)

  const form = await prisma.form.create({
    data: {
      ...validatedData,
      organizationId,
      eventId
    }
  })

  revalidatePath(`/admin/organizations/${organizationId}/forms`)
  return form
}

export async function updateForm(formId: string, formData: unknown) {
  const form = await prisma.form.findUniqueOrThrow({ where: { id: formId } })

  const currentUser = await getUser()
  if (
    !currentUser ||
    !(await isOrganizerAdmin(form.organizationId, currentUser.id))
  ) {
    throw new Error('Unauthorized')
  }

  const validatedData = FormSchema.parse(formData)

  const updatedForm = await prisma.form.update({
    where: { id: formId },
    data: validatedData
  })

  revalidatePath(`/admin/organizations/${form.organizationId}/forms`)
  return updatedForm
}

export async function deleteForm(formId: string) {
  const form = await prisma.form.findUniqueOrThrow({ where: { id: formId } })

  const currentUser = await getUser()
  if (
    !currentUser ||
    !(await isOrganizerAdmin(form.organizationId, currentUser.id))
  ) {
    throw new Error('Unauthorized')
  }

  await prisma.form.update({
    where: { id: formId },
    data: { deletedAt: new Date() }
  })

  revalidatePath(`/admin/organizations/${form.organizationId}/forms`)
}

export async function submitForm(formId: string, submissionData: unknown) {
  const form = await prisma.form.findUniqueOrThrow({ where: { id: formId } })
  const currentUser = await getUser()
  if (!currentUser) {
    throw new Error('Unauthorized')
  }

  const validatedData = FormSubmissionSchema.parse(submissionData)

  const submission = await prisma.formSubmission.create({
    data: {
      formId,
      userId: currentUser.id,
      eventId: form.eventId,
      data: validatedData.data as InputJsonValue
    }
  })

  return submission
}

export async function getFormSubmissions(formId: string) {
  const form = await prisma.form.findUniqueOrThrow({ where: { id: formId } })

  const currentUser = await getUser()
  if (
    !currentUser ||
    !(await isOrganizerAdmin(form.organizationId, currentUser.id))
  ) {
    throw new Error('Unauthorized')
  }

  return prisma.formSubmission.findMany({
    where: { formId },
    include: { user: true }
  })
}
