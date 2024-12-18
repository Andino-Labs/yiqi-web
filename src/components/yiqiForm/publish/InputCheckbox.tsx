'use client'

import React from 'react'

import { Controller, useFormContext } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FormProps } from '@/schemas/yiqiFormSchema'

interface InputCheckboxProps {
  id: string
  fields: FormProps[]
}

const InputCheckbox = ({ id, fields }: InputCheckboxProps) => {
  const { control } = useFormContext()
  const currentField = fields.find(field => field.id === id) as FormProps
  const contents = Array.isArray(currentField.contents)
    ? currentField.contents
    : []

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto "
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {contents.map(content => (
        <Controller
          key={content.id}
          name={`${id}.${content.id}`}
          control={control}
          render={({ field: { onChange } }) => (
            <div className="flex items-center space-x-4 rounded-lg p-4 py-2 ">
              <Checkbox
                id={content.id}
                onCheckedChange={checked => {
                  onChange({
                    id: content.id,
                    text: content.text,
                    checked
                  })
                }}
                className="h-5 w-5 border-2 border-gray-300 rounded-md 
                    hover:border-primary hover:ring-2 hover:ring-primary/20
                    data-[state=checked]:bg-primary data-[state=checked]:border-primary
                    
                    transition-all duration-200 ease-in-out"
              />
              <Label
                htmlFor={content.id}
                className="text-sm md:text-base font-medium leading-none 
                          cursor-pointer select-none flex-1
                          peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {content.text}
              </Label>
            </div>
          )}
        />
      ))}
    </motion.div>
  )
}

export default InputCheckbox
