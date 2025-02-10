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

  console.log(form.formState.errors)

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
      const { presignedUrl, s3Key } = await presignedResponse.json()

      // 2. Upload file directly to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': 'application/pdf' }
      })

      if (!uploadResponse.ok) throw new Error('Upload failed')

      // 3. Process file with Textract
      const textractResponse = await fetch('/api/aws/textract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ s3Key })
      })

      if (!textractResponse.ok) throw new Error('Text extraction failed')
      const { text } = await textractResponse.json()

      // 4. Update form values
      const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`
      form.setValue('resumeUrl', publicUrl)
      form.setValue('resumeText', text)
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
