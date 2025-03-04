'use client'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormProps, InputTypes } from '@/schemas/yiqiFormSchema'
import { useTranslations } from 'next-intl'

interface TextFieldSectionProps {
  id: string
  fields: FormProps[]
  setText: (cardId: string, text: string, contentId?: string) => void
}
const TextFieldSection = ({ id, fields, setText }: TextFieldSectionProps) => {
  const { control } = useForm()
  const t = useTranslations('YiqiForm')

  const currentField = fields.find(field => field.id === id)
  const inputType = currentField?.inputType
  const contents = currentField?.contents as string
  const isFocused = currentField?.isFocused
  const isTitle = inputType === InputTypes.TITLE

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setText(id, e.target.value)
  }

  const handlePlaceholder = () => {
    if (isTitle) return t('formDescription')
    if (inputType === InputTypes.TEXT) return t('shortText')
    return t('longText')
  }

  return (
    <Controller
      name="TextFieldInput"
      control={control}
      render={() => (
        <div
          className={`
            ${isTitle ? 'w-full' : inputType === InputTypes.TEXT ? 'w-full' : 'w-[100%]'}
            transition-all duration-200
          `}
        >
          {inputType === InputTypes.TEXT ? (
            <Input
              className={`
                text-sm
                ${isTitle ? 'border-none focus:border-gray-600' : 'border-b border-dotted border-gray-600 '}
                ${isFocused ? 'focus:border-gray-400' : ''}
                disabled:opacity-50
                focus:outline-none focus:ring-0
              `}
              value={contents}
              onChange={handleDescriptionChange}
              placeholder={handlePlaceholder()}
              disabled={!isTitle}
            />
          ) : (
            <Textarea
              className={`
                text-sm resize-none
                ${isTitle ? 'border-none focus:border-gray-600' : 'border-b border-dotted border-gray-600 '}
                ${isFocused ? 'focus:border-gray-300' : ''}
                disabled:opacity-50
                focus:outline-none focus:ring-0
              `}
              value={contents}
              onChange={handleDescriptionChange}
              placeholder={handlePlaceholder()}
              disabled={!isTitle}
            />
          )}
        </div>
      )}
    />
  )
}

export default TextFieldSection
