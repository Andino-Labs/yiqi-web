import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { NetworkingData } from '@/components/profile/common'
import { makeRegularUser } from '@/services/actions/userActions'
import { saveNetworkingProfile } from '@/services/actions/user/saveNetworkingProfile'
import { processResume } from '@/lib/resume/resumeProcessor'
import type { ProfileWithPrivacy } from '@/schemas/userSchema'
import { ONBOARDING_STEPS, QuestionStep } from './constants'

export function useOnboardingState(
  userId: string,
  userProfile: ProfileWithPrivacy | null
) {
  const t = useTranslations('Onboarding')
  const { toast } = useToast()
  const router = useRouter()

  // Current step
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form data
  const [formData, setFormData] = useState<NetworkingData>({
    professionalMotivations: userProfile?.professionalMotivations || '',
    communicationStyle: userProfile?.communicationStyle || '',
    professionalValues: userProfile?.professionalValues || '',
    careerAspirations: userProfile?.careerAspirations || '',
    significantChallenge: userProfile?.significantChallenge || '',
    resumeUrl: userProfile?.resumeUrl || '',
    resumeText: userProfile?.resumeText || '',
    resumeLastUpdated: userProfile?.resumeLastUpdated || '',
    resumeFileName: userProfile?.resumeUrl
      ? new URL(userProfile.resumeUrl).pathname.split('/').pop() || ''
      : ''
  })

  // Initialize selectedOptions from userProfile
  const initialSelectedOptions: Record<string, string[]> = {}
  if (userProfile) {
    if (userProfile.professionalMotivations) {
      // Check if the value matches one of the predefined options
      const isStandardOption = [
        'impact',
        'growth',
        'stability',
        'creativity',
        'leadership'
      ].includes(userProfile.professionalMotivations)
      initialSelectedOptions.professionalMotivations = isStandardOption
        ? [userProfile.professionalMotivations]
        : ['other']

      // Also store using the step ID for the UI
      initialSelectedOptions.motivations =
        initialSelectedOptions.professionalMotivations
    }

    if (userProfile.communicationStyle) {
      const isStandardOption = [
        'direct',
        'collaborative',
        'analytical',
        'supportive'
      ].includes(userProfile.communicationStyle)
      initialSelectedOptions.communicationStyle = isStandardOption
        ? [userProfile.communicationStyle]
        : ['other']

      // Also store using the step ID for the UI
      initialSelectedOptions.communication =
        initialSelectedOptions.communicationStyle
    }

    if (userProfile.professionalValues) {
      const values = userProfile.professionalValues.split(',')
      const standardValues = values.filter(value =>
        [
          'autonomy',
          'balance',
          'ethics',
          'innovation',
          'recognition',
          'teamwork'
        ].includes(value)
      )

      initialSelectedOptions.professionalValues = standardValues
      if (values.length > standardValues.length) {
        initialSelectedOptions.professionalValues.push('other')
      }

      // Also store using the step ID for the UI
      initialSelectedOptions.values = initialSelectedOptions.professionalValues
    }

    if (userProfile.careerAspirations) {
      const isStandardOption = [
        'leadership',
        'specialist',
        'entrepreneur',
        'mentor'
      ].includes(userProfile.careerAspirations)
      initialSelectedOptions.careerAspirations = isStandardOption
        ? [userProfile.careerAspirations]
        : ['other']

      // Also store using the step ID for the UI
      initialSelectedOptions.aspirations =
        initialSelectedOptions.careerAspirations
    }

    if (userProfile.significantChallenge) {
      const isStandardOption = [
        'technical',
        'team',
        'resources',
        'leadership'
      ].includes(userProfile.significantChallenge)
      initialSelectedOptions.significantChallenge = isStandardOption
        ? [userProfile.significantChallenge]
        : ['other']

      // Also store using the step ID for the UI
      initialSelectedOptions.challenge =
        initialSelectedOptions.significantChallenge
    }
  }

  // Input state
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >(initialSelectedOptions)

  // Initialize customResponses for non-standard values
  const initialCustomResponses: Record<string, string> = {}
  if (userProfile) {
    // For each field, if we selected 'other', store the actual value as the custom response
    if (initialSelectedOptions.professionalMotivations?.includes('other')) {
      initialCustomResponses.professionalMotivations =
        userProfile.professionalMotivations || ''
      // Also store using the step ID for the UI
      initialCustomResponses.motivations =
        initialCustomResponses.professionalMotivations
    }

    if (initialSelectedOptions.communicationStyle?.includes('other')) {
      initialCustomResponses.communicationStyle =
        userProfile.communicationStyle || ''
      // Also store using the step ID for the UI
      initialCustomResponses.communication =
        initialCustomResponses.communicationStyle
    }

    if (initialSelectedOptions.professionalValues?.includes('other')) {
      // For values, we need to find the non-standard values
      const standardValues = [
        'autonomy',
        'balance',
        'ethics',
        'innovation',
        'recognition',
        'teamwork'
      ]
      const values = userProfile.professionalValues?.split(',') || []
      const otherValues = values.filter(
        value => !standardValues.includes(value)
      )
      initialCustomResponses.professionalValues = otherValues.join(', ')
      // Also store using the step ID for the UI
      initialCustomResponses.values = initialCustomResponses.professionalValues
    }

    if (initialSelectedOptions.careerAspirations?.includes('other')) {
      initialCustomResponses.careerAspirations =
        userProfile.careerAspirations || ''
      // Also store using the step ID for the UI
      initialCustomResponses.aspirations =
        initialCustomResponses.careerAspirations
    }

    if (initialSelectedOptions.significantChallenge?.includes('other')) {
      initialCustomResponses.significantChallenge =
        userProfile.significantChallenge || ''
      // Also store using the step ID for the UI
      initialCustomResponses.challenge =
        initialCustomResponses.significantChallenge
    }
  }

  const [customResponses, setCustomResponses] = useState<
    Record<string, string>
  >(initialCustomResponses)

  // File processing state
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [processingStatus, setProcessingStatus] = useState<string>('')
  const [processingError, setProcessingError] = useState<string | null>(null)

  // Refs
  const contentRef = useRef<HTMLDivElement>(null)
  const fileProcessingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Define steps
  const steps: QuestionStep[] = useMemo(
    () =>
      ONBOARDING_STEPS.map(step => ({
        ...step,
        title: t(step.title),
        description: t(step.description),
        options: step.options?.map(option => ({
          ...option,
          label: t(option.label)
        }))
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // Set a timeout for file processing to prevent infinite loading
  useEffect(() => {
    return () => {
      if (fileProcessingTimeoutRef.current) {
        clearTimeout(fileProcessingTimeoutRef.current)
      }
    }
  }, [])

  // When the step changes, scroll to the top of the content
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0)
    }
  }, [currentStep])

  // File processing function
  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Reset previous errors
      setProcessingError(null)
      setIsProcessingFile(true)
      setSelectedFile(file)

      // Set a timeout of 2 minutes for the entire process
      fileProcessingTimeoutRef.current = setTimeout(() => {
        setIsProcessingFile(false)
        setProcessingStatus('')
        setProcessingError(
          'Processing timeout. Please try again or use a smaller file.'
        )
        toast({
          title: t('resumeUploadError'),
          description:
            'Processing timeout. Please try again or use a smaller file.',
          variant: 'destructive'
        })
      }, 120000) // 2 minutes

      const result = await processResume(file, setProcessingStatus)

      // Update form data with the file information and extracted text
      setFormData(prev => ({
        ...prev,
        resumeUrl: result.publicUrl,
        resumeText: result.extractedText,
        resumeFileName: result.fileName,
        resumeLastUpdated: new Date().toISOString()
      }))

      // Success message
      toast({
        title: t('resumeUploadSuccess'),
        description: t('resumeUploadSuccessDescription')
      })
    } catch (error) {
      console.error('File processing error:', error)
      setProcessingError(
        error instanceof Error ? error.message : 'Unknown error'
      )
      toast({
        title: t('resumeUploadError'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      })
    } finally {
      if (fileProcessingTimeoutRef.current) {
        clearTimeout(fileProcessingTimeoutRef.current)
        fileProcessingTimeoutRef.current = null
      }
      setIsProcessingFile(false)
      setProcessingStatus('')
    }
  }

  // Form input handlers
  const handleRadioChange = (field: string, value: string) => {
    // Map to store the relationship between step ID and field name
    const fieldMap: Record<string, keyof NetworkingData> = {
      motivations: 'professionalMotivations',
      communication: 'communicationStyle',
      values: 'professionalValues',
      aspirations: 'careerAspirations',
      challenge: 'significantChallenge'
    }

    // Get the corresponding field name if this is a step ID
    const fieldName = fieldMap[field] || field

    if (value === 'other') {
      setSelectedOptions(prev => ({
        ...prev,
        [field]: [value],
        ...(fieldName !== field ? { [fieldName]: [value] } : {})
      }))
    } else {
      setSelectedOptions(prev => ({
        ...prev,
        [field]: [value],
        ...(fieldName !== field ? { [fieldName]: [value] } : {})
      }))

      // Update form data directly for non-other options
      const step = steps.find(s => s.id === field)
      if (step && step.options && step.field !== 'complete') {
        const option = step.options.find(o => o.value === value)
        if (option) {
          const fieldKey = step.field as keyof NetworkingData
          setFormData(prevData => ({
            ...prevData,
            [fieldKey]: option.value // Store the value, not the label
          }))
        }
      }
    }
  }

  const handleCheckboxChange = (
    field: string,
    value: string,
    checked: boolean
  ) => {
    // Map to store the relationship between step ID and field name
    const fieldMap: Record<string, keyof NetworkingData> = {
      motivations: 'professionalMotivations',
      communication: 'communicationStyle',
      values: 'professionalValues',
      aspirations: 'careerAspirations',
      challenge: 'significantChallenge'
    }

    // Get the corresponding field name if this is a step ID
    const fieldName = fieldMap[field] || field

    const currentValues = selectedOptions[field] || []
    let newValues: string[]

    if (checked) {
      newValues = [...currentValues, value]
    } else {
      newValues = currentValues.filter(v => v !== value)
    }

    setSelectedOptions(prev => ({
      ...prev,
      [field]: newValues,
      ...(fieldName !== field ? { [fieldName]: newValues } : {})
    }))

    // If "other" is unchecked, remove the custom response
    if (value === 'other' && !checked) {
      const newCustomResponses = { ...customResponses }
      delete newCustomResponses[field]
      if (fieldName !== field) {
        delete newCustomResponses[fieldName]
      }
      setCustomResponses(newCustomResponses)
    }

    // Update form data directly for checkbox type
    if (field === 'professionalValues' || field === 'values') {
      const step = steps.find(s => s.id === field)
      if (step && step.options && step.field !== 'complete') {
        const selectedValues = newValues.filter(v => v !== 'other')

        setFormData(prevData => {
          const fieldKey = step.field as keyof NetworkingData
          return {
            ...prevData,
            [fieldKey]: selectedValues.join(',') // Store values, not labels
          }
        })
      }
    }
  }

  const handleCustomResponseChange = (field: string, value: string) => {
    // Map to store the relationship between step ID and field name
    const fieldMap: Record<string, keyof NetworkingData> = {
      motivations: 'professionalMotivations',
      communication: 'communicationStyle',
      values: 'professionalValues',
      aspirations: 'careerAspirations',
      challenge: 'significantChallenge'
    }

    // Get the corresponding field name if this is a step ID
    const fieldName = fieldMap[field] || field

    setCustomResponses(prev => ({
      ...prev,
      [field]: value,
      ...(fieldName !== field ? { [fieldName]: value } : {})
    }))

    // Update form data directly when custom response changes
    if (
      selectedOptions[field]?.includes('other') ||
      (fieldName !== field && selectedOptions[fieldName]?.includes('other'))
    ) {
      const step = steps.find(s => s.id === field)
      if (step && step.field !== 'complete') {
        const fieldKey = step.field as keyof NetworkingData
        setFormData(prevData => ({
          ...prevData,
          [fieldKey]: value.trim() ? value : prevData[fieldKey]
        }))
      }
    }
  }

  // Navigation handlers
  const handleNext = () => {
    const currentField = steps[currentStep].field
    const isLastQuestion = currentStep === steps.length - 2 // Check if this is the last question before completion
    const isMovingToCompletionScreen = isLastQuestion

    if (currentField !== 'complete' && currentField !== 'resumeUrl') {
      const selectedOpts = selectedOptions[steps[currentStep].id] || []
      const step = steps.find(s => s.id === steps[currentStep].id)

      // Move to next step immediately
      setCurrentStep(prev => prev + 1)

      // If we're moving to the completion screen, start showing loading state
      if (isMovingToCompletionScreen) {
        router.prefetch('/events')

        setIsSubmitting(true)
        setProcessingStatus(t('processingProfileData'))

        // Make sure we have a timeout to stop loading even if something fails
        const loadingTimeout = setTimeout(() => {
          setIsSubmitting(false)
          setProcessingStatus('')
        }, 30000) // 30 seconds max for loading

        // Helper to clean up timeout and loading state
        const finishLoading = () => {
          clearTimeout(loadingTimeout)
          setIsSubmitting(false)
          setProcessingStatus('')
        }

        // Save data and process profile
        let savePromise: Promise<void> | null = null

        if (selectedOpts.includes('other')) {
          const customValue = customResponses[steps[currentStep].id] || ''
          if (customValue.trim()) {
            savePromise = saveNetworkingProfile(
              {
                ...formData,
                [currentField]: customValue
              },
              userId,
              isLastQuestion
            )
          }
        } else if (step?.type === 'checkbox') {
          savePromise = saveNetworkingProfile(formData, userId, isLastQuestion)
        } else if (selectedOpts.length > 0) {
          if (step && step.options) {
            const option = step.options.find(o => o.value === selectedOpts[0])
            if (option && option.value !== 'other') {
              savePromise = saveNetworkingProfile(
                {
                  ...formData,
                  [currentField]: option.value
                },
                userId,
                isLastQuestion
              )
            }
          }
        }

        // If we created a save promise, add error handling and finish loading when done
        if (savePromise) {
          savePromise
            .catch(error => {
              console.error('Error saving data:', error)
              toast({
                title: t('errorSaving'),
                description: t('errorSavingDescription'),
                variant: 'destructive'
              })
            })
            .finally(() => {
              finishLoading()
            })
        } else {
          // If there's no data to save but we're still going to completion screen,
          // manually trigger processing with just the current form data
          saveNetworkingProfile(formData, userId, isLastQuestion)
            .catch(error => {
              console.error('Error processing profile:', error)
              toast({
                title: t('errorSaving'),
                description: t('errorSavingDescription'),
                variant: 'destructive'
              })
            })
            .finally(() => {
              finishLoading()
            })
        }
      } else {
        // Regular data save for non-final steps
        if (selectedOpts.includes('other')) {
          const customValue = customResponses[steps[currentStep].id] || ''
          if (customValue.trim()) {
            saveNetworkingProfile(
              {
                ...formData,
                [currentField]: customValue
              },
              userId,
              false
            ).catch(error => {
              console.error('Error saving data:', error)
              toast({
                title: t('errorSaving'),
                description: t('errorSavingDescription'),
                variant: 'destructive'
              })
            })
          }
        } else if (step?.type === 'checkbox') {
          saveNetworkingProfile(formData, userId, false).catch(error => {
            console.error('Error saving data:', error)
            toast({
              title: t('errorSaving'),
              description: t('errorSavingDescription'),
              variant: 'destructive'
            })
          })
        } else if (selectedOpts.length > 0) {
          if (step && step.options) {
            const option = step.options.find(o => o.value === selectedOpts[0])
            if (option && option.value !== 'other') {
              saveNetworkingProfile(
                {
                  ...formData,
                  [currentField]: option.value
                },
                userId,
                false
              ).catch(error => {
                console.error('Error saving data:', error)
                toast({
                  title: t('errorSaving'),
                  description: t('errorSavingDescription'),
                  variant: 'destructive'
                })
              })
            }
          }
        }
      }
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSkip = async () => {
    try {
      setIsSubmitting(true)
      await makeRegularUser({ userId })
      toast({
        title: t('skippedTitle'),
        description: t('skippedDescription')
      })
      router.push('/events')
    } catch (error) {
      console.error('Error skipping onboarding:', error)
      toast({
        title: t('errorTitle'),
        description: t('errorDescription'),
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleComplete = useCallback(async () => {
    try {
      // Just navigate without reprocessing since data is already processed
      await makeRegularUser({ userId })
      toast({
        title: t('successTitle'),
        description: t('successDescription')
      })
      router.push('/events')
    } catch (error) {
      console.error('Error in onboarding completion:', error)
      toast({
        title: t('errorTitle'),
        description: t('errorDescription'),
        variant: 'destructive'
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  // Calculate progress
  const currentProgress = ((currentStep + 1) / steps.length) * 100

  return {
    // State
    currentStep,
    isSubmitting,
    formData,
    selectedOptions,
    customResponses,
    isProcessingFile,
    selectedFile,
    processingStatus,
    processingError,
    contentRef,
    steps,
    currentProgress,

    // Handlers
    handleFileChange,
    handleRadioChange,
    handleCheckboxChange,
    handleCustomResponseChange,
    handleNext,
    handlePrevious,
    handleSkip,
    handleComplete
  }
}
