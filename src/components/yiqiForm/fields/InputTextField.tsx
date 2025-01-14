'use client'

import React, { useMemo } from 'react'

import { Controller, useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import { FormProps, InputTypes } from '../../../schemas/yiqiFormSchema'
import { useTranslations } from 'next-intl'

interface InputFieldProps {
  id: string
  fields: FormProps[]
}

const InputTextField = ({ id, fields }: InputFieldProps) => {
  const { control } = useFormContext()
  const t = useTranslations('yiqiForm')
  const inputType = useMemo(() => {
    const currentField = fields.find(field => field.id === id) as FormProps
    return currentField.inputType
  }, [fields, id])
  return (
    <Controller
      name={id}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Input
          onChange={onChange}
          value={value}
          placeholder={t('writeYourAnswer')}
          className={cn(
            'w-full border-0 border-b-2 rounded-none',
            'bg-transparent',
            'text-slate-900 border-slate-300 placeholder:text-slate-500',
            'dark:text-white dark:border-slate-700 dark:placeholder:text-muted-foreground',
            'focus:outline-none focus:border-blue-500 dark:focus:border-blue-400',
            'transition-all duration-300 ease-in-out',
            'placeholder:text-base placeholder:font-light placeholder:tracking-wide',
            'hover:border-slate-400 dark:hover:border-slate-600',
            'text-lg py-2 px-0',
            'font-medium tracking-tight',
            inputType === InputTypes.TEXT ? 'max-w-[350px]' : 'max-w-full'
          )}
          style={{
            boxShadow: 'none',
            transition: 'box-shadow 0.3s ease'
          }}
          autoComplete="off"
          autoCorrect="off"
        />
      )}
    />
  )
}

export default InputTextField
