'use server'

import importUsers from '@/lib/importUsers'
import { z } from 'zod'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const ImportResponseSchema = z.object({
  success: z.boolean(),
  totalCreated: z.number().optional(),
  totalUpdated: z.number().optional(),
  errors: z
    .array(
      z.object({
        email: z.string(),
        error: z.string().optional(),
        success: z.boolean()
      })
    )
    .transform(results => {
      return results
        .filter(result => !result.success)
        .map(result => {
          return {
            message: result.email + ' failed due to ' + result?.error
          }
        })
    })
})

export async function importUsersAction(
  formData: FormData
): Promise<z.infer<typeof ImportResponseSchema>> {
  try {
    const file = formData.get('file')
    const orgId = formData.get('orgId') as string

    if (!file || !(file instanceof Blob)) {
      throw new Error('No file provided')
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size too large')
    }

    // Convert Blob to Buffer and then to string
    const buffer = Buffer.from(await file.arrayBuffer())
    const text = buffer.toString('utf-8')

    const importResume = await importUsers(orgId, text)

    const response = {
      success: true,
      totalCreated: importResume.created,
      totalUpdated: importResume.updated,
      errors: importResume.results
    }
    return ImportResponseSchema.parse(response)
  } catch (error) {
    return {
      success: false,
      errors: [
        {
          message:
            error instanceof Error ? error.message : 'Unknown error occurred'
        }
      ]
    }
  }
}
