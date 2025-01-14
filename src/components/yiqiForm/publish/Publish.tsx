'use client'
import { FieldReponseSchemas, Form, FormProps } from '@/schemas/yiqiFormSchema'
import React, { useEffect, useRef, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import PublishCard from './PublishCard'
import GoogleOAuthButton from '@/components/auth/googleButton'
import LinkedInOAuthButton from '@/components/auth/LinkedinButton'
import { createFormSubmission } from '@/services/actions/typeForm/typeFormActions'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
export interface UserProps {
  name: string
  email: string
  picture: string | null
  id: string
  role: 'USER' | 'ADMIN' | 'ANDINO_ADMIN' | 'NEW_USER'
}
type PublishProps = {
  form: Form
  user: UserProps | null
}

const generateValidationSchema = (requiredFields: FormProps[]) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {}
  requiredFields.forEach((field: FormProps) => {
    const { id, inputType } = field
    if (inputType in FieldReponseSchemas) {
      schemaShape[id] =
        FieldReponseSchemas[inputType as keyof typeof FieldReponseSchemas]
    } else {
      console.warn(`Tipo de campo desconocido: ${inputType}`)
    }
  })
  return z.object(schemaShape)
}

const Publish: React.FC<PublishProps> = ({ form, user }) => {
  const methods = useForm()
  const t = useTranslations('yiqiForm')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!user)
  const [firstEmptyFieldId, setFirstEmptyFieldId] = useState<string | null>(
    null
  )
  const { toast } = useToast()
  const cardRefs = useRef<Map<string, React.RefObject<HTMLDivElement>>>(
    new Map(
      form.fields.map(card => [card.id, React.createRef<HTMLDivElement>()])
    )
  )

  const handleSubmit = async () => {
    const formValues = methods.getValues()
    const requiredFields = form.fields.filter(field => field.isRequired)
    const validationSchema = generateValidationSchema(requiredFields)
    try {
      validationSchema.parse(formValues)
      const formData = form.fields.map(field => {
        return {
          id: field.id,
          value: formValues[field.id]
        }
      })
      const submissionData = {
        formId: form.id,
        data: formData,
        eventId: form.eventId ?? null
      }
      try {
        const response = await createFormSubmission(submissionData)
        if (response) {
          toast({
            description: t('responsesSent'),
            variant: 'default'
          })
        }
      } catch (error) {
        toast({
          description: `${t('errorOccurred')}: ${error}`,
          variant: 'default'
        })
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0]
        const firstEmptyField = form.fields.find(
          field => field.id === firstError.path[0]
        )
        if (firstEmptyField) {
          setFirstEmptyFieldId(firstEmptyField.id)
          const cardRef = cardRefs.current.get(firstEmptyField.id)
          if (cardRef && cardRef.current) {
            cardRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
          }
          methods.setFocus(firstEmptyField.id)
        }
      }
    }
  }
  useEffect(() => {
    if (user) {
      setIsAuthModalOpen(false)
    }
  }, [user])
  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 dark:bg-transparent">
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-[#000] rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden"
              initial={{
                scale: 0.9,
                opacity: 0,
                y: 20
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
                y: 20
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
            >
              <div className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <motion.h2
                    className="text-3xl font-bold text-slate-900 dark:text-white"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {t('loginToContinue')}
                  </motion.h2>
                  <motion.p
                    className="text-slate-600 dark:text-slate-400"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {t('loginToFillForm')}
                  </motion.p>
                </div>

                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <GoogleOAuthButton />
                  <div className="relative ">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-white dark:bg-black text-slate-500 dark:text-slate-400 text-sm">
                        {t('or')}
                      </span>
                    </div>
                  </div>
                  <LinkedInOAuthButton />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <FormProvider {...methods}>
          <form
            className="space-y-6"
            onSubmit={methods.handleSubmit(() => {
              try {
                handleSubmit()
              } catch (e) {
                console.dir(e)
              }
            })}
          >
            <motion.div
              className="space-y-4"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {form.fields.map(card => (
                <motion.div
                  key={card.id}
                  ref={cardRefs.current.get(card.id)}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <PublishCard
                    fields={form.fields}
                    card={card}
                    user={user}
                    isFirstEmptyField={firstEmptyFieldId === card.id}
                    onValueChange={isValid => {
                      if (firstEmptyFieldId === card.id && isValid) {
                        setFirstEmptyFieldId(null)
                      }
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                type="submit"
                className="w-full sm:w-auto 
              bg-white dark:bg-slate-200 
              text-black 
              hover:bg-slate-100 dark:hover:bg-slate-300 
              border border-slate-200 dark:border-slate-300
              font-semibold
              transition-all duration-300 ease-in-out 
              shadow-md hover:shadow-lg 
              transform "
              >
                {t('submit')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:w-auto 
              text-black dark:text-white 
              bg-transparent 
              hover:bg-slate-100 dark:hover:bg-slate-800 
              border border-slate-300 dark:border-slate-700
              transition-all duration-300 ease-in-out
              transform "
                onClick={() => {
                  methods.reset()
                  setFirstEmptyFieldId(null)
                }}
              >
                {t('clear')}
              </Button>
            </motion.div>
          </form>
        </FormProvider>
      </motion.div>
    </div>
  )
}

export default Publish
