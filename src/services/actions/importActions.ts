'use server'

import importUsers from '@/lib/importUsers'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function importUsersAction(formData: FormData) {
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

    await importUsers(orgId, text)

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
