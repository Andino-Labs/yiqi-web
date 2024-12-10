'use client'

import React, { useMemo } from 'react'

import { Controller, useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import { FormProps, InputTypes } from '../../../schemas/yiqiFormSchema'

interface InputFieldProps {
  id: string
  fields: FormProps[]
}

const InputTextField = ({ id, fields }: InputFieldProps) => {
  const { control } = useFormContext()

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
          placeholder="Pregunta"
          className={cn(
            'h-10 border-0 border-b rounded-none bg-red-500',
            'focus:border-b-2 focus:border-gray-400',
            'placeholder:text-sm',
            'border-gray-300 hover:border-gray-400',
            'transition-all duration-200',
            inputType === InputTypes.TEXT ? 'w-[295px]' : 'w-[590px]'
          )}
        />
      )}
    />
  )
}

export default InputTextField
