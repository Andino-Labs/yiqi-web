'use client'

import React, { useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { FormProps } from '../../schemas/yiqiFormSchema'
import { generateUniqueId } from './utils'
import { translations } from '@/lib/translations/translations'

interface AddCardButtonProps {
  fields: FormProps[]
  addCard: (
    focusedCardIndex: number,
    cardId: string,
    cardTitle?: string
  ) => void
}

const AddCardButton = ({ fields, addCard }: AddCardButtonProps) => {
  const focusedCardIndex = useMemo(
    () => fields.findIndex(card => card.isFocused),
    [fields]
  )

  const handleAddCard = useCallback(() => {
    addCard(focusedCardIndex, generateUniqueId())
  }, [addCard, focusedCardIndex])

  return (
    <div
      className={cn(
        'md:static fixed bottom-6 right-4',
        'z-50 md:z-auto',
        'flex items-center justify-center',
        'isolation-auto'
      )}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={handleAddCard}
                size="lg"
                className={cn(
                  'relative h-14 rounded-full shadow-lg',
                  'md:h-11 md:w-11 md:rounded-lg md:shadow-sm',
                  'bg-primary dark:bg-[#fff] hover:bg-primary/90',
                  'text-primary-foreground',
                  'transition-all duration-200',
                  'flex items-center gap-2 px-6 md:px-3',
                  'hover:shadow-md',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2'
                )}
              >
                <Plus className="h-5 w-5  dark:text-[#1F1F1F]" />
                <span className="md:hidden dark:text-[#1F1F1F]">
                  {translations.es.addQuestion}
                </span>
                <span className="sr-only">
                  {translations.es.addNewQuestion}
                </span>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="left" className="hidden md:block">
            {translations.es.addQuestion}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default AddCardButton
