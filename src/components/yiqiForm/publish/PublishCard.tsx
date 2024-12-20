import {
  FormProps,
  InputTypes,
  FieldReponseSchemas,
  FieldResponseKeys
} from '@/schemas/yiqiFormSchema'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import InputTextField from '../fields/InputTextField'
import { UserProps } from './Publish'
import InputRadio from './InputRadio'
import InputCheckbox from './InputCheckbox'
import InputSelect from './InputSelect'
import { useFormContext } from 'react-hook-form'
import { UserInfoCard } from './UserInfoCard'
import { useTranslations } from 'next-intl'

interface PublishCardProps {
  fields: FormProps[]
  card: FormProps
  user: UserProps | null
  isFirstEmptyField?: boolean
  onValueChange?: (value: boolean) => void
}
const isFieldValid = (
  inputType: FieldResponseKeys,
  value: unknown
): boolean => {
  const schema = FieldReponseSchemas[inputType]
  if (!schema) return false
  return schema.safeParse(value).success
}

const PublishCard = ({
  fields,
  card,
  user,
  isFirstEmptyField = false,
  onValueChange
}: PublishCardProps) => {
  const { id, inputType, isRequired } = card
  const isTitle = inputType === InputTypes.TITLE
  const { watch } = useFormContext()
  const t = useTranslations('yiqiForm')
  const value = watch(id)
  useEffect(() => {
    if (onValueChange) {
      const isValid =
        inputType in FieldReponseSchemas
          ? isFieldValid(inputType as keyof typeof FieldReponseSchemas, value)
          : false
      onValueChange(isValid)
    }
  }, [value, onValueChange, inputType])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  }

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative rounded-lg overflow-hidden mt-4 w-full max-w-2xl mx-auto"
      >
        <div
          className={cn(
            'flex flex-col relative bg-white dark:bg-transparent rounded-lg min-h-[131px] p-6',
            'border transition-all duration-200',
            isFirstEmptyField
              ? 'border-red-500 dark:border-red-600'
              : 'border-slate-200 dark:border-[#333]',
            'w-full'
          )}
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col w-full mb-2"
            >
              <motion.div
                className="flex w-full justify-start items-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span
                  className={cn(
                    'py-2',
                    isTitle
                      ? 'text-xl md:text-2xl font-medium'
                      : 'text-base md:text-lg',
                    'text-slate-900 dark:text-slate-100 transition-all duration-200'
                  )}
                >
                  {card.cardTitle}
                </span>
                {isRequired && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="pl-1 text-base text-red-500"
                  >
                    *
                  </motion.span>
                )}
              </motion.div>
              {isTitle && (
                <motion.div
                  className="flex flex-col w-full items-start mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-base md:text-lg text-slate-600 dark:text-muted-foreground mb-4">
                    {card.contents as string}
                  </span>
                </motion.div>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {inputType === InputTypes.TEXT && (
                <InputTextField id={id} fields={fields} />
              )}
              {inputType === InputTypes.TEXTAREA && (
                <InputTextField id={id} fields={fields} />
              )}
              {inputType === InputTypes.RADIO && (
                <InputRadio id={id} fields={fields} />
              )}
              {inputType === InputTypes.CHECKBOX && (
                <InputCheckbox id={id} fields={fields} />
              )}
              {inputType === InputTypes.SELECT && (
                <InputSelect id={id} fields={fields} />
              )}
            </motion.div>
            {isFirstEmptyField && isRequired && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end h-[30px] w-full"
              >
                <span className="text-xs text-red-500 dark:text-red-400">
                  {t('fieldRequired')}
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
      {isTitle && <UserInfoCard user={user} />}
    </>
  )
}

export default PublishCard
