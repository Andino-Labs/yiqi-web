'use client'

import React, { useCallback, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormProps } from '../../../schemas/yiqiFormSchema'
import { generateUniqueIdYiqiForm } from '../utils'
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
    addCard(focusedCardIndex, generateUniqueIdYiqiForm())
  }, [addCard, focusedCardIndex])

  return (
    <Button
      variant="secondary"
      size="sm"
      className="gap-2 mr-2 
    bg-secondary/10 
    text-secondary-foreground 
    hover:bg-secondary/20 
    dark:bg-secondary/20 
    dark:hover:bg-secondary/30"
      onClick={handleAddCard}
    >
      <Plus className="h-4 w-4" />
      <span className=" ">{translations.es.addQuestion}</span>
      <span className="sr-only">{translations.es.addNewQuestion}</span>
    </Button>
  )
}

export default AddCardButton
