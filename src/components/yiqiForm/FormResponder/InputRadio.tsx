'use client'
import React, { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { motion } from 'framer-motion'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormProps } from '@/schemas/yiqiFormSchema'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
interface InputRadioProps {
  id: string
  fields: FormProps[]
}
const InputRadio = ({ id, fields }: InputRadioProps) => {
  const etcRef = useRef<HTMLInputElement>(null)
  const etcRefRadio = useRef<HTMLInputElement>(null)
  const { control } = useFormContext()
  const t = useTranslations('yiqiForm')
  const currentField = fields.find(field => field.id === id) as FormProps
  const contents = Array.isArray(currentField.contents)
    ? currentField.contents
    : []
  return (
    <Controller
      control={control}
      name={id}
      render={({ field: { onChange, value } }) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl mx-auto"
        >
          <RadioGroup
            onValueChange={(selectedValue: string) => {
              const selectedOption = contents.find(
                content => content.id === selectedValue
              )

              if (selectedOption) {
                onChange({
                  id: selectedOption.id,
                  text: selectedOption.isEtc ? '' : selectedOption.text,
                  isEtc: selectedOption.isEtc || false,
                  question: currentField.cardTitle
                })

                if (selectedOption.isEtc) {
                  setTimeout(() => {
                    etcRef.current?.focus()
                  }, 0)
                }
              }
            }}
            ref={etcRefRadio}
            value={value?.isEtc ? value.id : value?.id}
            className="flex flex-col mt-2 gap-0"
          >
            {contents.map(content => (
              <div
                key={content.id}
                className="flex items-center space-x-2 rounded-lg p-4 py-2 "
              >
                <RadioGroupItem
                  id={content.id}
                  value={content.id}
                  className="h-5 w-5 border-2 border-gray-300 text-primary 
                    hover:border-primary hover:ring-2 hover:ring-primary/20 
                    transition-all duration-200 ease-in-out"
                />
                <Label
                  htmlFor={content.id}
                  className="flex-1 cursor-pointer text-sm md:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {content.isEtc ? (
                    <div className="flex items-center gap-3">
                      <span>{t('other')}:</span>
                      <Input
                        ref={etcRef}
                        className={cn(
                          'max-w-[200px] h-8 px-2 border-0 border-b-2 rounded-none',
                          'bg-transparent',
                          'text-slate-900 border-slate-300 placeholder:text-slate-500',
                          'dark:text-white dark:border-slate-700 dark:placeholder:text-muted-foreground',
                          'focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0  focus:border-blue-500 dark:focus:border-blue-400',
                          'transition-all duration-300 ease-in-out',
                          'placeholder:text-base placeholder:font-light placeholder:tracking-wide',
                          'hover:border-slate-400 dark:hover:border-slate-600',
                          'text-lg py-2 px-0',
                          'font-medium tracking-tight'
                        )}
                        value={etcRef.current?.value ?? ''}
                        onFocus={() => {
                          onChange({
                            id: content.id,
                            text: etcRef.current?.value ?? '',
                            isEtc: true,
                            question: currentField.cardTitle
                          })
                        }}
                        onChange={e => {
                          onChange({
                            id: content.id,
                            text: e.target.value,
                            isEtc: true,
                            question: currentField.cardTitle
                          })
                        }}
                        placeholder={t('writeHere')}
                      />
                    </div>
                  ) : (
                    content.text
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </motion.div>
      )}
    />
  )
}

export default InputRadio
