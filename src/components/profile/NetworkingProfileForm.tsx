'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Textarea } from '../ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { saveNetworkingProfile } from '@/services/actions/user/saveNetworkingProfile'
import { translations } from '@/lib/translations/translations'
import { FileText, Loader2, Save, Upload } from 'lucide-react'
import { userDataCollectedShema } from '@/schemas/userSchema'
import type { UserDataCollected } from '@/schemas/userSchema'
import { useRouter } from 'next/navigation'
import { Input } from '../ui/input'
import { scheduleUserDataProcessing } from '@/services/actions/networking/scheduleUserDataProcessing'

export type NetworkingData = Pick<
  UserDataCollected,
  | 'professionalMotivations'
  | 'communicationStyle'
  | 'professionalValues'
  | 'careerAspirations'
  | 'significantChallenge'
  | 'resumeUrl'
  | 'resumeText'
  | 'resumeLastUpdated'
>

type Props = {
  initialData: NetworkingData
  userId: string
}

export default function NetworkingProfileForm({ initialData, userId }: Props) {
  const { toast } = useToast()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessingFile, setIsProcessingFile] = useState(false)

  const form = useForm<NetworkingData>({
    resolver: zodResolver(
      userDataCollectedShema.pick({
        professionalMotivations: true,
        communicationStyle: true,
        professionalValues: true,
        careerAspirations: true,
        significantChallenge: true,
        resumeUrl: true,
        resumeText: true,
        resumeLastUpdated: true
      })
    ),
    defaultValues: {
      professionalMotivations: initialData.professionalMotivations ?? '',
      communicationStyle: initialData.communicationStyle ?? '',
      professionalValues: initialData.professionalValues ?? '',
      careerAspirations: initialData.careerAspirations ?? '',
      significantChallenge: initialData.significantChallenge ?? '',
      resumeUrl: initialData.resumeUrl ?? '',
      resumeText: initialData.resumeText ?? '',
      resumeLastUpdated: initialData.resumeLastUpdated ?? ''
    }
  })

  async function processData(userId: string) {
    try {
      await scheduleUserDataProcessing(userId)
    } catch (error) {
      toast({
        variant: 'destructive',
        description: `${error}`
      })
    }
  }

  // Define Textract supported MIME types (add more as needed)
  const TEXTRACT_SUPPORTED_TYPES = new Set([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/tiff'
  ])

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsProcessingFile(true)
      setSelectedFile(file)

      // 1. Get presigned URL
      const presignedResponse = await fetch('/api/aws/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name })
      })

      if (!presignedResponse.ok) throw new Error('Failed to get upload URL')
      const { presignedUrl, s3Key, publicUrl } = await presignedResponse.json()

      // 2. Upload file to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      })

      if (!uploadResponse.ok) throw new Error('Upload failed')

      // 3. Extract text based on file type
      let extractedText: string
      if (TEXTRACT_SUPPORTED_TYPES.has(file.type)) {
        // Use Textract for supported types
        const textractResponse = await fetch('/api/aws/textract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ s3Key })
        })
        if (!textractResponse.ok) throw new Error('Text extraction failed')
        extractedText = (await textractResponse.json()).text
      } else {
        // Client-side extraction for other document types
        extractedText = await extractTextClientSide(file)
      }

      // 4. Update form values
      form.setValue('resumeUrl', publicUrl)
      form.setValue('resumeText', extractedText)
      form.setValue('resumeLastUpdated', new Date().toISOString())
    } catch (error) {
      console.error('File processing error:', error)
      toast({
        title: translations.es.resumeUploadError,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      })
    } finally {
      setIsProcessingFile(false)
    }
  }

  async function extractTextClientSide(file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()

    if (fileExtension === 'doc') {
      throw new Error(
        'formato DOC no esta soportado. por favor convertir a  DOCX  PDF.'
      )
    }

    const arrayBuffer = await file.arrayBuffer()

    switch (fileExtension) {
      case 'docx':
        return await parseDocx(arrayBuffer)
      case 'odt':
        return await parseOdt(arrayBuffer)
      case 'txt':
      case 'csv':
        return await readFileAsText(file)
      default:
        throw new Error(`Unsupported file type: ${file.type}`)
    }
  }
  function readFileAsText(file: File): Promise<string> {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader()
      reader.onload = function (event: ProgressEvent<FileReader>) {
        if (event.target?.result) {
          resolve(event.target.result.toString())
        } else {
          reject(new Error('Failed to read text file'))
        }
      }
      reader.onerror = function () {
        reject(new Error('File read error'))
      }
      reader.readAsText(file)
    })
  }

  async function parseDocx(arrayBuffer: ArrayBuffer): Promise<string> {
    try {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ arrayBuffer })
      return result.value
    } catch (error) {
      throw new Error(
        `DOCX parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async function parseOdt(arrayBuffer: ArrayBuffer): Promise<string> {
    const JSZip = await import('jszip')
    const zip = await new JSZip.default().loadAsync(arrayBuffer)
    const content = await zip.file('content.xml')?.async('text')
    if (!content) throw new Error('Invalid ODT file')
    return extractTextFromOdtXml(content)
  }

  function extractTextFromOdtXml(xmlContent: string): string {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlContent, 'text/xml')
    const paragraphs = Array.from(doc.getElementsByTagName('text:p'))

    return paragraphs
      .map(function (p) {
        return p.textContent ? p.textContent.replace(/\s+/g, ' ').trim() : ''
      })
      .filter(function (text) {
        return text.length > 0
      })
      .join('\n\n')
  }

  async function onSubmit(values: NetworkingData) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()

      Object.entries(values).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value)
        }
      })

      await saveNetworkingProfile(values, userId)

      await processData(userId)

      toast({
        title: translations.es.networkingProfileSaved
      })
      router.refresh()
    } catch (error) {
      console.error('Error in onSubmit:', error)
      toast({
        title: translations.es.networkingProfileError,
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{translations.es.networkingProfileTitle}</CardTitle>
        <CardDescription className="space-y-3">
          {translations.es.networkingProfileDescription}
        </CardDescription>
        <CardDescription>{translations.es.networkingBenefits}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Resume Upload Section */}
            <div className="space-y-4">
              <FormLabel>{translations.es.resumeUploadLabel}</FormLabel>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept=".pdf,.txt,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                    disabled={isProcessingFile}
                  />
                  <label
                    htmlFor="resume-upload"
                    className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                      isProcessingFile
                        ? 'bg-gray-100 cursor-not-allowed text-gray-500'
                        : 'bg-white hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    {isProcessingFile ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {translations.es.uploadingResume}
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        <p className="text-black">
                          {translations.es.selectResumeTypes}
                        </p>
                      </>
                    )}
                  </label>
                </div>
                {selectedFile && !isProcessingFile && (
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{selectedFile.name}</span>
                  </div>
                )}
              </div>
              {isProcessingFile && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 mr-2 inline animate-spin" />
                  {translations.es.extractingText}
                </div>
              )}
              {initialData.resumeUrl && !selectedFile && !isProcessingFile && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{translations.es.currentResume}</span>
                  <a
                    href={initialData.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {translations.es.viewResume}
                  </a>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="professionalMotivations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {translations.es.professionalMotivationsLabel}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        translations.es.professionalMotivationsPlaceholder
                      }
                      className="min-h-[100px]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="communicationStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {translations.es.communicationStyleLabel}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        translations.es.communicationStylePlaceholder
                      }
                      className="min-h-[100px]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="professionalValues"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {translations.es.professionalValuesLabel}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        translations.es.professionalValuesPlaceholder
                      }
                      className="min-h-[100px]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="careerAspirations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {translations.es.careerAspirationsLabel}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={translations.es.careerAspirationsPlaceholder}
                      className="min-h-[100px]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="significantChallenge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {translations.es.significantChallengeLabel}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        translations.es.significantChallengePlaceholder
                      }
                      className="min-h-[100px]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isProcessingFile}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  <span>{translations.es.saveNetworkingProfile}</span>
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
