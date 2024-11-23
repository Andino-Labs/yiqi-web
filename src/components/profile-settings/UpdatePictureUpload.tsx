import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { translations } from '@/lib/translations/translations'

interface ProfilePictureUploadProps {
  readonly currentValue?: string | File | null
  readonly onChange: (file: File) => void
  readonly name: string
  readonly userPicture: string
}

export default function ProfilePictureUpload({
  currentValue: value,
  onChange,
  name,
  userPicture
}: ProfilePictureUploadProps) {
  const [preview, setPreview] = useState<string>(userPicture)

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    } else if (typeof value === 'string') {
      setPreview(value)
    } else {
      setPreview(userPicture)
    }
  }, [value, userPicture])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        onChange(file)
        const fileUrl = URL.createObjectURL(file)
        setPreview(fileUrl)
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-x-6"
    >
      <div {...getRootProps()}>
        <input {...getInputProps()} name={name} />
        <Avatar className="h-24 w-24 cursor-pointer transition-transform hover:scale-105">
          <AvatarImage src={preview} />
          <AvatarFallback>
            {isDragActive ? (
              <Upload className="h-8 w-8 animate-bounce text-muted-foreground" />
            ) : (
              name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
            )}
          </AvatarFallback>
        </Avatar>
      </div>
      <Button
        variant="outline"
        type="button"
        {...getRootProps()}
        className="relative overflow-hidden"
      >
        <motion.div
          animate={isDragActive ? { y: 0 } : { y: '100%' }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-primary"
        />
        <span className={isDragActive ? 'text-primary-foreground' : ''}>
          {isDragActive
            ? translations.es.dropHere
            : translations.es.changePicture}
        </span>
      </Button>
    </motion.div>
  )
}
