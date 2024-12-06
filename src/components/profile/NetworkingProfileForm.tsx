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
import { useUpload } from '@/hooks/useUpload'

type NetworkingData = Pick<
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
}

export default function NetworkingProfileForm({ initialData }: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { uploadSingle, isUploading } = useUpload()
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

  console.log(form.formState.errors)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      if (
        file.type !== 'application/pdf' &&
        file.type !== 'text/plain' &&
        file.type !==
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        toast({
          title: translations.es.invalidFileType,
          description: translations.es.onlyPDFAndTXTAndDOCXAllowed,
          variant: 'destructive'
        })
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: translations.es.fileTooLarge,
          description: translations.es.maxFileSize,
          variant: 'destructive'
        })
        return
      }

      try {
        setIsProcessingFile(true)
        setSelectedFile(file)
        const url = await uploadSingle(file)
        form.setValue('resumeUrl', url)
        form.setValue('resumeLastUpdated', new Date().toISOString())
      } catch (error) {
        console.error('Error uploading file:', error)
        toast({
          title: translations.es.resumeUploadError,
          variant: 'destructive'
        })
      } finally {
        setIsProcessingFile(false)
      }
    }
  }

  const onSubmit = async (values: NetworkingData) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()

      Object.entries(values).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value)
        }
      })

      const result = await saveNetworkingProfile(formData)

      if (result.success) {
        toast({
          title: translations.es.networkingProfileSaved
        })
        router.refresh()
      } else {
        toast({
          title: translations.es.networkingProfileError,
          variant: 'destructive'
        })
      }
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
              disabled={isSubmitting || isUploading}
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
