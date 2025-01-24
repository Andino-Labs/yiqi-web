'use client'

import { useState } from 'react'

const ALLOWED_FILE_TYPES = ['application/pdf', 'image/png', 'image/tiff']

interface UseTextractResult {
  extractText: (file: File) => Promise<void>
  extractedText: string | null
  isLoading: boolean
  error: string | null
}

export function useTextract(): UseTextractResult {
  const [extractedText, setExtractedText] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  async function extractText(file: File): Promise<void> {
    setExtractedText(null)
    setError(null)
    setIsLoading(true)

    try {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw new Error(
          'Invalid file type. Please upload a PDF, PNG, or TIFF file.'
        )
      }

      const reader = new FileReader()
      reader.onload = async (event: ProgressEvent<FileReader>) => {
        if (event.target && event.target.result) {
          const arrayBuffer = event.target.result as ArrayBuffer
          const base64String = btoa(
            new Uint8Array(arrayBuffer).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          )

          const response = await fetch('/api/aws/textract', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ file: base64String, fileType: file.type })
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(
              errorData.error || 'Failed to extract text. Please try again.'
            )
          }

          const data = await response.json()
          setExtractedText(data.text)
        }
      }

      reader.onerror = () => {
        throw new Error('Failed to read file. Please try again.')
      }

      reader.readAsArrayBuffer(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    extractText,
    extractedText,
    isLoading,
    error
  }
}
