'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, Upload, X, File as FileIcon } from 'lucide-react'
import { useUpload } from '@/hooks/useUpload'

interface UploadedFile {
  name: string
  url: string
}

interface DragDropZoneProps {
  onUploadComplete: (urls: string[]) => void
}

function DragDropZone({ onUploadComplete }: DragDropZoneProps) {
  const { uploadMany, isUploading, error } = useUpload()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const urls = await uploadMany(acceptedFiles)
        const newFiles = acceptedFiles.map((file, index) => ({
          name: file.name,
          url: urls[index]
        }))
        setUploadedFiles(prevFiles => [...prevFiles, ...newFiles])
        onUploadComplete(urls)
      } catch (err) {
        console.error('Upload failed:', err)
      }
    },
    [uploadMany, onUploadComplete]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  function handleDelete(index: number) {
    setUploadedFiles(prevFiles => {
      const newFiles = [...prevFiles]
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-muted-foreground'
        }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
        ) : isDragActive ? (
          <p className="text-primary">Drop the files here ...</p>
        ) : (
          <p>
            Drag &apos;n&apos; drop some files here, or click to select files
          </p>
        )}
      </div>
      {error && <p className="text-destructive mt-2">{error.message}</p>}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Uploaded Files:</h3>
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-muted p-2 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <FileIcon className="w-4 h-4" />
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    {file.name}
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(index)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <X className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}

interface SingleFileUploadProps {
  onUploadComplete: (url: string) => void
}

function SingleFileUpload({ onUploadComplete }: SingleFileUploadProps) {
  const { uploadSingle, isUploading, error } = useUpload()
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const url = await uploadSingle(file)
        setUploadedFile({ name: file.name, url })
        onUploadComplete(url)
      } catch (err) {
        console.error('Upload failed:', err)
      }
    }
  }

  function handleDelete() {
    setUploadedFile(null)
  }

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="flex items-center justify-center w-full">
        <label htmlFor="single-file-upload" className="w-full">
          <Button variant="outline" className="w-full" disabled={isUploading}>
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {isUploading ? 'Uploading...' : 'Choose File'}
          </Button>
          <input
            id="single-file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>
      {error && <p className="text-destructive mt-2">{error.message}</p>}
      {uploadedFile && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Uploaded File:</h3>
          <div className="flex items-center justify-between bg-muted p-2 rounded-md">
            <div className="flex items-center space-x-2">
              <FileIcon className="w-4 h-4" />
              <a
                href={uploadedFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                {uploadedFile.name}
              </a>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive/90"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

export { SingleFileUpload, DragDropZone }
