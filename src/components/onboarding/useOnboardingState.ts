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
  const initialSelectedOptions = useMemo(() => {
    const options: Record<string, string[]> = {}
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
        options.professionalMotivations = isStandardOption
          ? [userProfile.professionalMotivations]
          : ['other']

        // Also store using the step ID for the UI
        options.motivations = options.professionalMotivations
      }

      if (userProfile.communicationStyle) {
        const isStandardOption = [
          'direct',
          'collaborative',
          'analytical',
          'supportive'
        ].includes(userProfile.communicationStyle)
        options.communicationStyle = isStandardOption
          ? [userProfile.communicationStyle]
          : ['other']

        // Also store using the step ID for the UI
        options.communication = options.communicationStyle
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

        options.professionalValues = standardValues
        if (values.length > standardValues.length) {
          options.professionalValues.push('other')
        }

        // Also store using the step ID for the UI
        options.values = options.professionalValues
      }

      if (userProfile.careerAspirations) {
        const isStandardOption = [
          'leadership',
          'specialist',
          'entrepreneur',
          'mentor'
        ].includes(userProfile.careerAspirations)
        options.careerAspirations = isStandardOption
          ? [userProfile.careerAspirations]
          : ['other']

        // Also store using the step ID for the UI
        options.aspirations = options.careerAspirations
      }

      if (userProfile.significantChallenge) {
        const isStandardOption = [
          'technical',
          'team',
          'resources',
          'leadership'
        ].includes(userProfile.significantChallenge)
        options.significantChallenge = isStandardOption
          ? [userProfile.significantChallenge]
          : ['other']

        // Also store using the step ID for the UI
        options.challenge = options.significantChallenge
      }
    }
    return options
  }, [userProfile])

  // Input state
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >(initialSelectedOptions)

  // Initialize customResponses for non-standard values
  const initialCustomResponses = useMemo(() => {
    const responses: Record<string, string> = {}
    if (userProfile) {
      // For each field, if we selected 'other', store the actual value as the custom response
      if (initialSelectedOptions.professionalMotivations?.includes('other')) {
        responses.professionalMotivations =
          userProfile.professionalMotivations || ''
        // Also store using the step ID for the UI
        responses.motivations = responses.professionalMotivations
      }

      if (initialSelectedOptions.communicationStyle?.includes('other')) {
        responses.communicationStyle = userProfile.communicationStyle || ''
        // Also store using the step ID for the UI
        responses.communication = responses.communicationStyle
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
        responses.professionalValues = otherValues.join(', ')
        // Also store using the step ID for the UI
        responses.values = responses.professionalValues
      }

      if (initialSelectedOptions.careerAspirations?.includes('other')) {
        responses.careerAspirations = userProfile.careerAspirations || ''
        // Also store using the step ID for the UI
        responses.aspirations = responses.careerAspirations
      }

      if (initialSelectedOptions.significantChallenge?.includes('other')) {
        responses.significantChallenge = userProfile.significantChallenge || ''
        // Also store using the step ID for the UI
        responses.challenge = responses.significantChallenge
      }
    }
    return responses
  }, [userProfile, initialSelectedOptions])

  const [customResponses, setCustomResponses] = useState<
    Record<string, string>
  >(initialCustomResponses)

  // File processing state - Combined into a single state object
  const [fileProcessing, setFileProcessing] = useState({
    isProcessing: false,
    selectedFile: null as File | null,
    status: '',
    error: null as string | null
  })

  // Fixed to use ReturnType of setTimeout to avoid type error
  const fileProcessingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  // Refs
  const contentRef = useRef<HTMLDivElement>(null)

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
    [t]
  )

  // Field mapping for easier reference
  const fieldMap = useMemo(
    () =>
      ({
        motivations: 'professionalMotivations',
        communication: 'communicationStyle',
        values: 'professionalValues',
        aspirations: 'careerAspirations',
        challenge: 'significantChallenge'
      }) as Record<string, keyof NetworkingData>,
    []
  )

  // Clean up timeout on unmount
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

  // File processing function - optimized with useCallback
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      try {
        // Reset previous errors and update state in one operation
        setFileProcessing({
          isProcessing: true,
          selectedFile: file,
          status: '',
          error: null
        })

        // Set a timeout of 2 minutes for the entire process
        if (fileProcessingTimeoutRef.current) {
          clearTimeout(fileProcessingTimeoutRef.current)
        }

        fileProcessingTimeoutRef.current = setTimeout(() => {
          setFileProcessing(prev => ({
            ...prev,
            isProcessing: false,
            status: ''
          }))

          const errorMsg =
            'Processing timeout. Please try again or use a smaller file.'

          setFileProcessing(prev => ({
            ...prev,
            error: errorMsg
          }))

          toast({
            title: t('resumeUploadError'),
            description: errorMsg,
            variant: 'destructive'
          })
        }, 120000) // 2 minutes

        const result = await processResume(file, status => {
          setFileProcessing(prev => ({
            ...prev,
            status
          }))
        })

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
        const errorMsg =
          error instanceof Error ? error.message : 'Unknown error'

        setFileProcessing(prev => ({
          ...prev,
          error: errorMsg
        }))

        toast({
          title: t('resumeUploadError'),
          description: errorMsg,
          variant: 'destructive'
        })
      } finally {
        if (fileProcessingTimeoutRef.current) {
          clearTimeout(fileProcessingTimeoutRef.current)
          fileProcessingTimeoutRef.current = null
        }

        setFileProcessing(prev => ({
          ...prev,
          isProcessing: false,
          status: ''
        }))
      }
    },
    [t, toast]
  )

  // Form input handlers - optimized with useCallback
  const handleRadioChange = useCallback(
    (field: string, value: string) => {
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
    },
    [fieldMap, steps]
  )

  const handleCheckboxChange = useCallback(
    (field: string, value: string, checked: boolean) => {
      // Get the corresponding field name if this is a step ID
      const fieldName = fieldMap[field] || field

      setSelectedOptions(prev => {
        const currentValues = prev[field] || []
        let newValues: string[]

        if (checked) {
          newValues = [...currentValues, value]
        } else {
          newValues = currentValues.filter(v => v !== value)
        }

        return {
          ...prev,
          [field]: newValues,
          ...(fieldName !== field ? { [fieldName]: newValues } : {})
        }
      })

      // If "other" is unchecked, remove the custom response
      if (value === 'other' && !checked) {
        setCustomResponses(prev => {
          const newCustomResponses = { ...prev }
          delete newCustomResponses[field]
          if (fieldName !== field) {
            delete newCustomResponses[fieldName]
          }
          return newCustomResponses
        })
      }

      // Update form data directly for checkbox type
      if (field === 'professionalValues' || field === 'values') {
        const step = steps.find(s => s.id === field)
        if (step && step.options && step.field !== 'complete') {
          setSelectedOptions(prev => {
            const currentValues = prev[field] || []
            let newValues: string[]

            if (checked) {
              newValues = [...currentValues, value]
            } else {
              newValues = currentValues.filter(v => v !== value)
            }

            const selectedValues = newValues.filter(v => v !== 'other')

            setFormData(prevData => {
              const fieldKey = step.field as keyof NetworkingData
              return {
                ...prevData,
                [fieldKey]: selectedValues.join(',') // Store values, not labels
              }
            })

            return {
              ...prev,
              [field]: newValues,
              ...(fieldName !== field ? { [fieldName]: newValues } : {})
            }
          })
        }
      }
    },
    [fieldMap, steps]
  )

  const handleCustomResponseChange = useCallback(
    (field: string, value: string) => {
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
    },
    [fieldMap, steps, selectedOptions]
  )

  // Save data helper function
  const saveData = useCallback(
    async (data: NetworkingData, isFinal: boolean) => {
      try {
        await saveNetworkingProfile(data, userId, isFinal)
        return true
      } catch (error) {
        console.error('Error saving data:', error)
        toast({
          title: t('errorSaving'),
          description: t('errorSavingDescription'),
          variant: 'destructive'
        })
        return false
      }
    },
    [userId, t, toast]
  )

  // Navigation handlers - optimized with useCallback
  const handleNext = useCallback(() => {
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
        setFileProcessing(prev => ({
          ...prev,
          status: t('processingProfileData')
        }))

        // Make sure we have a timeout to stop loading even if something fails
        const loadingTimeout = setTimeout(() => {
          setIsSubmitting(false)
          setFileProcessing(prev => ({
            ...prev,
            status: ''
          }))
        }, 30000) // 30 seconds max for loading

        // Helper to clean up timeout and loading state
        const finishLoading = () => {
          clearTimeout(loadingTimeout)
          setIsSubmitting(false)
          setFileProcessing(prev => ({
            ...prev,
            status: ''
          }))
        }

        // Save data and process profile
        let dataToSave = { ...formData }

        if (selectedOpts.includes('other')) {
          const customValue = customResponses[steps[currentStep].id] || ''
          if (customValue.trim()) {
            dataToSave = {
              ...dataToSave,
              [currentField]: customValue
            }
          }
        } else if (step?.type !== 'checkbox' && selectedOpts.length > 0) {
          if (step && step.options) {
            const option = step.options.find(o => o.value === selectedOpts[0])
            if (option && option.value !== 'other') {
              dataToSave = {
                ...dataToSave,
                [currentField]: option.value
              }
            }
          }
        }

        // Save the data
        saveData(dataToSave, true).finally(() => {
          finishLoading()
        })
      } else {
        // Regular data save for non-final steps
        let dataToSave = { ...formData }

        if (selectedOpts.includes('other')) {
          const customValue = customResponses[steps[currentStep].id] || ''
          if (customValue.trim()) {
            dataToSave = {
              ...dataToSave,
              [currentField]: customValue
            }
          }
        } else if (step?.type !== 'checkbox' && selectedOpts.length > 0) {
          if (step && step.options) {
            const option = step.options.find(o => o.value === selectedOpts[0])
            if (option && option.value !== 'other') {
              dataToSave = {
                ...dataToSave,
                [currentField]: option.value
              }
            }
          }
        }

        saveData(dataToSave, false)
      }
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }, [
    currentStep,
    steps,
    selectedOptions,
    customResponses,
    formData,
    router,
    saveData,
    t
  ])

  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => prev - 1)
  }, [])

  const handleSkip = useCallback(async () => {
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
  }, [userId, t, toast, router])

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
  }, [userId, t, toast, router])

  // Calculate progress
  const currentProgress = ((currentStep + 1) / steps.length) * 100

  return {
    // State
    currentStep,
    isSubmitting,
    formData,
    selectedOptions,
    customResponses,
    isProcessingFile: fileProcessing.isProcessing,
    selectedFile: fileProcessing.selectedFile,
    processingStatus: fileProcessing.status,
    processingError: fileProcessing.error,
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
