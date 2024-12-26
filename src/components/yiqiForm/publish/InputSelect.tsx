'use client'

import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { motion } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { FormProps } from '@/schemas/yiqiFormSchema'

interface InputSelectProps {
  id: string
  fields: FormProps[]
}

const InputSelect = ({ id, fields }: InputSelectProps) => {
  const { control } = useFormContext()
  const currentField = fields.find(field => field.id === id) as FormProps
  const contents = Array.isArray(currentField.contents)
    ? currentField.contents
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Controller
        control={control}
        name={id}
        render={({ field: { onChange } }) => (
          <Select
            onValueChange={(selectedValue: string) => {
              const selectedOption = contents.find(
                obj => obj.id === selectedValue
              )
              onChange({
                id: selectedOption?.id ?? '',
                text: selectedOption?.text ?? ''
              })
            }}
            defaultValue=""
          >
            <SelectTrigger
              className="w-full h-12 px-4 text-left 
            bg-white dark:bg-transparent
            border-2 border-gray-200 dark:border-gray-800 
            rounded-lg
            hover:border-primary/50 dark:hover:border-primary/50
            transition-all duration-200 
            group   focus:ring-0 focus:ring-transparent focus:ring-offset-0"
            >
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent
              style={{
                boxShadow:
                  '0 0 0 1px hsla(0, 0%, 100%, .145), 0px 1px 1px #00000005, 0px 4px 8px -4px #0000000a, 0px 16px 24px -8px #0000000f'
              }}
              className="max-h-[300px] overflow-y-auto 
            border-none shadow-lg dark:shadow-xl 
            rounded-lg"
            >
              {contents.map(content => (
                <SelectItem
                  key={content.id}
                  value={content.id}
                  className="cursor-pointer 
                py-3 px-4
                hover:bg-primary/5 dark:hover:bg-[#ffffff0f]
                focus:bg-primary/10 dark:focus:bg-[#ffffff0f]
                hover:text-primary 
                transition-colors duration-150 
                rounded-md"
                >
                  {content.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </motion.div>
  )
}

export default InputSelect
