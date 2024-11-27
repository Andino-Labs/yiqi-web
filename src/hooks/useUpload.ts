import { UploadManyToS3, UploadToS3 } from '@/lib/uploadToS3'
import { useState } from 'react'

interface UploadHookResult {
  uploadSingle: (file: File) => Promise<string>
  uploadMany: (files: File[]) => Promise<string[]>
  isUploading: boolean
  error: Error | null
}

export function useUpload(): UploadHookResult {
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const uploadSingle = async (file: File): Promise<string> => {
    setIsUploading(true)
    setError(null)
    try {
      const url = await UploadToS3(file)
      return url
    } catch (err) {
      const uploadError =
        err instanceof Error
          ? err
          : new Error('An error occurred during upload')
      setError(uploadError)
      throw uploadError
    } finally {
      setIsUploading(false)
    }
  }

  const uploadMany = async (files: File[]): Promise<string[]> => {
    setIsUploading(true)
    setError(null)
    try {
      const urls = await UploadManyToS3(files)
      return urls
    } catch (err) {
      const uploadError =
        err instanceof Error
          ? err
          : new Error('An error occurred during upload')
      setError(uploadError)
      throw uploadError
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadSingle, uploadMany, isUploading, error }
}
