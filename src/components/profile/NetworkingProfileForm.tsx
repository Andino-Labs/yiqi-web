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
import { FileText, Loader2, Save, Upload, ArrowLeft } from 'lucide-react'
import { userDataCollectedShema } from '@/schemas/userSchema'
import { useRouter } from 'next/navigation'
import { Input } from '../ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'
import { NetworkingData, Props } from './common'

type NetworkingProfileFormProps = Props & {
  onComplete?: () => void
}

export default function NetworkingProfileForm({
  initialData,
  user,
  onComplete
}: NetworkingProfileFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const t = useTranslations('Networking')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [showLoadingModal, setShowLoadingModal] = useState(false)

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
        resumeLastUpdated: true,
        resumeFileName: true
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
      resumeLastUpdated: initialData.resumeLastUpdated ?? '',
      resumeFileName: initialData.resumeFileName ?? ''
    }
  })

  function extractFilenameFromUrl(url: string) {
    const filenamePart = url.substring(url.lastIndexOf('/') + 1)
    try {
      return decodeURIComponent(filenamePart)
    } catch (error) {
      toast({
        variant: 'destructive',
        description: `${error}`
      })
      return filenamePart
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
      form.setValue('resumeFileName', file.name)
      form.setValue('resumeText', extractedText)
      form.setValue('resumeLastUpdated', new Date().toISOString())
    } catch (error) {
      console.error('File processing error:', error)
      toast({
        title: t('resumeUploadError'),
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
    setShowLoadingModal(true)
    try {
      const formData = new FormData()

      Object.entries(values).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value)
        }
      })

      await saveNetworkingProfile(values, user.id)

      // Keep the loading modal visible for at least 2 seconds for better UX
      setTimeout(() => {
        setShowLoadingModal(false)
        toast({
          title: t('networkingProfileSaved')
        })
        router.refresh()
        if (onComplete) {
          onComplete()
        }
      }, 2000)
    } catch (error) {
      console.error('Error in onSubmit:', error)
      setShowLoadingModal(false)
      toast({
        title: t('networkingProfileError'),
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          {onComplete && (
            <div className="flex items-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onComplete}
                className="flex items-center gap-1 text-muted-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('backToProfile')}
              </Button>
            </div>
          )}
          <CardTitle>{t('networkingProfileTitle')}</CardTitle>
          <CardDescription className="space-y-3">
            {t('networkingProfileDescription')}
          </CardDescription>
          <CardDescription>{t('networkingBenefits')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Resume Upload Section */}
              <div className="space-y-4">
                <FormLabel>{t('resumeUploadLabel')}</FormLabel>
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
                          {t('uploadingResume')}
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          <p className="text-black">
                            {initialData.resumeUrl
                              ? t('editResume')
                              : t('selectResumeTypes')}
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
                    {t('extractingText')}
                  </div>
                )}
                {initialData.resumeUrl &&
                  !selectedFile &&
                  !isProcessingFile && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{t('currentResume')}</span>
                      <p className="text-primary hover:underline">
                        {initialData.resumeFileName ||
                          extractFilenameFromUrl(initialData.resumeUrl)}
                      </p>
                    </div>
                  )}
              </div>

              <FormField
                control={form.control}
                name="professionalMotivations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('professionalMotivationsLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('professionalMotivationsPlaceholder')}
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
                    <FormLabel>{t('communicationStyleLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('communicationStylePlaceholder')}
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
                    <FormLabel>{t('professionalValuesLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('professionalValuesPlaceholder')}
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
                    <FormLabel>{t('careerAspirationsLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('careerAspirationsPlaceholder')}
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
                    <FormLabel>{t('significantChallengeLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('significantChallengePlaceholder')}
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
                    <span>{t('saveNetworkingProfile')}</span>
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Loading Modal */}
      <Dialog open={showLoadingModal} onOpenChange={setShowLoadingModal}>
        <DialogContent className="sm:max-w-md" closeIcon={null}>
          <DialogHeader>
            <DialogTitle className="text-center">
              {t('savingNetworkingProfile')}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <div className="space-y-3 text-base text-center sm:text-lg">
              <p className="text-sm  mb-2">{t('processingTimeModalNotice')}</p>
              <p className="text-sm max-w-lg ">
                {t('profileBenefitsExplanation')}
              </p>
              <p className="text-[#B2B2B2] animate-pulse">
                {t('savingProfileData')}
              </p>
              <p
                className="text-[#B2B2B2] animate-pulse"
                style={{ animationDelay: '0.5s' }}
              >
                {t('analyzingPreferences')}
              </p>
              <p
                className="text-[#B2B2B2] animate-pulse"
                style={{ animationDelay: '1s' }}
              >
                {t('determiningContentPreferences')}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
