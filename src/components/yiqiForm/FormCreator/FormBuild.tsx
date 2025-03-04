'use client'
import React, { useCallback, useMemo } from 'react'

import { GripHorizontal } from 'lucide-react'
import { Card as ShadcnCard, CardContent } from '@/components/ui/card'
import { DragControls, motion } from 'framer-motion'
import { FormProps, InputTypes } from '../../../schemas/yiqiFormSchema'
import FieldHeader from './fields/FieldHeader'
import FieldFooter from './fields/FieldFooter'
import ItemTypeSection from './ItemTypeSection'
import TextFieldSection from './fields/TextFieldSection'
import { cn } from '@/lib/utils'

export interface ExtendedCardProps extends FormProps {
  isTitle: boolean
  id: string
  dragControls: DragControls
  focusField: (cardId: string) => void
  fields: FormProps[]
  typeChange: (id: string, newInputType: InputTypes) => void
  setTitle: (cardId: string, text: string) => void
  removeCard: (cardId: string) => void
  copyCard: (cardId: string, copiedCardId: string) => void
  toggleIsRequired: (id: string) => void
  addEtcItem: (id: string, contentId: string) => void
  addSelectItem: (id: string, contentId: string, text: string) => void
  removeSelectItem: (cardId: string, contentId: string) => void
  setText: (cardId: string, text: string, contentId?: string) => void
}

const Card = ({
  isTitle,
  id,
  dragControls,
  focusField,
  fields,
  typeChange,
  setTitle,
  removeCard,
  copyCard,
  toggleIsRequired,
  addEtcItem,
  addSelectItem,
  removeSelectItem,
  setText
}: ExtendedCardProps) => {
  const currentField = useMemo(
    () => fields.find(field => field.id === id),
    [fields, id]
  )

  const isFocused = useMemo(
    () => currentField?.isFocused ?? false,
    [currentField]
  )

  const inputType = useMemo(
    () => currentField?.inputType ?? null,
    [currentField]
  )

  const handleFocus = useCallback(() => {
    if (!isFocused) focusField(id)
  }, [focusField, id, isFocused])

  const isTextBasedInput = useMemo(
    () =>
      inputType === InputTypes.TITLE ||
      inputType === InputTypes.TEXT ||
      inputType === InputTypes.TEXTAREA,
    [inputType]
  )

  return (
    <div
      className={cn(
        'group relative w-full transition-all duration-200',
        'rounded-lg',
        'bg-background/50 dark:bg-[#1C1C1C]',
        isFocused &&
          'ring-2 ring-[rgba(0, 178, 218, .6)] dark:ring-[rgba(0, 178, 218, .6)]'
      )}
    >
      <ShadcnCard
        onClick={handleFocus}
        className={cn(
          'relative flex bg-transparent flex-col min-h-[138px] border-none w-full',
          'px-4 py-5 sm:px-6 sm:pt-8 sm:pb-6',
          'transition-colors duration-200',
          isFocused && !isTitle && 'pb-0',
          'backdrop-blur-sm'
        )}
      >
        {isTitle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-0 left-0 w-full h-2.5 bg-transparent z-20"
          />
        )}
        {!isTitle && (
          <div
            onPointerDown={event => dragControls.start(event)}
            className={cn(
              'absolute top-0 left-0 w-full h-5 sm:h-8',
              'z-20 flex items-center justify-center',
              'cursor-move touch-none'
            )}
          >
            <div
              className={cn(
                'rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                isFocused && 'opacity-100'
              )}
            >
              <GripHorizontal
                aria-hidden="true"
                className="h-4 w-4 text-muted-foreground text-slate-400 dark:text-slate-600"
              />
            </div>
          </div>
        )}

        <motion.div
          initial={false}
          animate={{
            backgroundColor: isFocused ? 'transparent' : ''
          }}
          className="absolute top-0 left-0 h-full w-1.5 z-10"
        />

        <CardContent className={cn('p-0 space-y-4', 'sm:space-y-5')}>
          <FieldHeader
            isTitle={isTitle}
            id={id}
            fields={fields}
            typeChange={typeChange}
            setTitle={setTitle}
          />

          {isTextBasedInput ? (
            <TextFieldSection fields={fields} id={id} setText={setText} />
          ) : (
            <ItemTypeSection
              id={id}
              fields={fields}
              addEtcItem={addEtcItem}
              addSelectItem={addSelectItem}
              removeSelectItem={removeSelectItem}
              setText={setText}
            />
          )}

          {isFocused && !isTitle && (
            <FieldFooter
              id={id}
              fields={fields}
              removeCard={removeCard}
              copyCard={copyCard}
              toggleIsRequired={toggleIsRequired}
            />
          )}
        </CardContent>
      </ShadcnCard>
    </div>
  )
}

export default React.memo(Card)
