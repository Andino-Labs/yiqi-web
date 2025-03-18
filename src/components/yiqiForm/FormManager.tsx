'use client'
import React, { useState } from 'react'
import FormBuild from './FormCreator/FormBuild'
import {
  FormModelEditResponse,
  FormProps,
  InputTypes,
  ItemTypeProps,
  submissionResponse
} from '../../schemas/yiqiFormSchema'
import YiqiFormLayout from './yiqiFormLayout'
import { usePathname } from 'next/navigation'
import { Reorder, useDragControls } from 'framer-motion'
import { generateUniqueIdYiqiForm } from './utils'
import { useTranslations } from 'next-intl'
import ResultForm from './FormResults/Result'
import { useIsMobile } from '@/hooks/use-mobile'

interface MainFormProps {
  orgId: string
  formResponse: FormModelEditResponse | null
  submissions: submissionResponse | null
  formId?: string
}

function FormManager({
  orgId,
  formResponse,
  submissions,
  formId
}: MainFormProps) {
  const t = useTranslations('yiqiForm')

  const [form, setForm] = useState<FormProps[]>(
    formResponse?.fields ?? [
      {
        id: 'TitleCard',
        cardTitle: t('formWithoutTitle'),
        inputType: InputTypes.TITLE,
        contents: '',
        isFocused: false,
        isRequired: false
      }
    ]
  )
  const dragControls = useDragControls()
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const [currentView, setCurrentView] = useState<'create' | 'results'>(
    pathname.includes('/results') ? 'results' : 'create'
  )

  const handleNavigation = (view: 'create' | 'results') => {
    setCurrentView(view)
  }

  const createNewCard = (cardId: string, cardTitle = ''): FormProps => ({
    id: cardId,
    cardTitle,
    inputType: InputTypes.RADIO,
    contents: [
      {
        id: generateUniqueIdYiqiForm(),
        text: t('option1')
      }
    ],
    isFocused: true,
    isRequired: false
  })

  const sortEtcItem = (currentContents: ItemTypeProps[]): ItemTypeProps[] => {
    const etcIndex = currentContents.findIndex(content => content.isEtc)
    if (etcIndex !== -1) {
      const etcItem = { ...currentContents[etcIndex] }
      currentContents.splice(etcIndex, 1)
      currentContents.push(etcItem)
    }
    return currentContents
  }

  const deleteEtcItem = (currentContents: ItemTypeProps[]): ItemTypeProps[] => {
    const etcIndex = currentContents.findIndex(content => content.isEtc)
    if (etcIndex !== -1) {
      currentContents.splice(etcIndex, 1)
    }
    return currentContents
  }

  const addCard = (
    focusedCardIndex: number,
    cardId: string,
    cardTitle = ''
  ) => {
    setForm(prev => {
      const copiedState = prev.map(card => ({ ...card, isFocused: false }))
      if (focusedCardIndex > 0) {
        copiedState.splice(
          focusedCardIndex + 1,
          0,
          createNewCard(cardId, cardTitle)
        )
      } else {
        copiedState.push(createNewCard(cardId, cardTitle))
      }
      return copiedState
    })
  }

  const copyCard = (cardId: string, copiedCardId: string) => {
    setForm(prev => {
      const copiedState = prev.map(card => ({ ...card, isFocused: false }))
      const targetCard = copiedState.find(card => card.id === cardId)
      if (!targetCard) return prev

      const targetCardIndex = copiedState.findIndex(card => card.id === cardId)
      const copiedCard = {
        ...targetCard,
        id: copiedCardId,
        isFocused: true
      }

      if (typeof copiedCard.contents === 'object') {
        const itemTypeCopiedCardContents = (
          copiedCard.contents as ItemTypeProps[]
        ).map((content, index) => ({
          ...content,
          id: String(Number(copiedCardId) + index)
        }))
        copiedCard.contents = itemTypeCopiedCardContents
      }

      copiedState.splice(targetCardIndex + 1, 0, copiedCard)
      return copiedState
    })
  }

  const removeCard = (cardId: string) => {
    setForm(prev => {
      if (prev.length <= 1) return prev
      const copiedState = prev.map(card => ({ ...card, isFocused: false }))
      const targetCardIndex = copiedState.findIndex(card => card.id === cardId)
      const filteredState = copiedState.filter(card => card.id !== cardId)
      if (targetCardIndex === 0) {
        return filteredState.map((card, index) =>
          index === 0 ? { ...card, isFocused: true } : card
        )
      } else {
        return filteredState.map((card, index) =>
          index === targetCardIndex - 1 ? { ...card, isFocused: true } : card
        )
      }
    })
  }

  const focusField = (id: string) => {
    setForm(prev =>
      prev.map(card =>
        card.id === id
          ? { ...card, isFocused: true }
          : { ...card, isFocused: false }
      )
    )
  }

  const typeChange = (id: string, newInputType: InputTypes) => {
    setForm(prev => {
      return prev.map(card => {
        if (card.id !== id) return card

        let newContents = card.contents
        const isCurrentItemType =
          card.inputType === InputTypes.RADIO ||
          card.inputType === InputTypes.CHECKBOX ||
          card.inputType === InputTypes.SELECT
        const isNewItemType =
          newInputType === InputTypes.RADIO ||
          newInputType === InputTypes.CHECKBOX ||
          newInputType === InputTypes.SELECT

        if (!isCurrentItemType && isNewItemType) {
          newContents = [{ id: generateUniqueIdYiqiForm(), text: 'Opción 1' }]
        } else if (isCurrentItemType && !isNewItemType) {
          newContents = ''
        } else if (
          card.inputType === InputTypes.RADIO &&
          (newInputType === InputTypes.SELECT ||
            newInputType === InputTypes.CHECKBOX)
        ) {
          newContents = deleteEtcItem(card.contents as ItemTypeProps[])
        }

        return {
          ...card,
          inputType: newInputType,
          contents: newContents
        }
      })
    })
  }

  const addSelectItem = (id: string, contentId: string, text: string) => {
    setForm(prev => {
      return prev.map(card => {
        if (card.id !== id) return card
        const newContents = [
          ...(card.contents as ItemTypeProps[]),
          { id: contentId, text }
        ]
        return {
          ...card,
          contents: sortEtcItem(newContents)
        }
      })
    })
  }

  const removeSelectItem = (cardId: string, contentId: string) => {
    setForm(prev => {
      return prev.map(card => {
        if (card.id !== cardId) return card
        return {
          ...card,
          contents: (card.contents as ItemTypeProps[]).filter(
            item => item.id !== contentId
          )
        }
      })
    })
  }

  const setTitle = (cardId: string, text: string) => {
    setForm(prev => {
      return prev.map(card => {
        if (card.id !== cardId) return card
        return {
          ...card,
          cardTitle: text
        }
      })
    })
  }

  const setText = (cardId: string, text: string, contentId?: string) => {
    setForm(prev => {
      return prev.map(card => {
        if (card.id !== cardId) return card

        if (card.inputType === InputTypes.TITLE) {
          return { ...card, contents: text }
        }

        if (
          card.inputType === InputTypes.RADIO ||
          card.inputType === InputTypes.CHECKBOX ||
          card.inputType === InputTypes.SELECT
        ) {
          const newContents = (card.contents as ItemTypeProps[]).map(content =>
            content.id === contentId ? { ...content, text } : content
          )
          return { ...card, contents: newContents }
        }

        return card
      })
    })
  }

  const addEtcItem = (id: string, contentId: string) => {
    setForm(prev => {
      return prev.map(card => {
        if (card.id !== id) return card
        const newContents = [
          ...(card.contents as ItemTypeProps[]),
          { id: contentId, isEtc: true }
        ]
        return { ...card, contents: newContents }
      })
    })
  }

  const toggleIsRequired = (id: string) => {
    setForm(prev => {
      return prev.map(card => {
        if (card.id !== id) return card
        return { ...card, isRequired: !card.isRequired }
      })
    })
  }

  const handleReorder = (newOrder: FormProps[]) => {
    if (!isMobile) {
      setForm(newOrder)
    }
  }

  return (
    <YiqiFormLayout
      form={form}
      orgId={orgId}
      onNavigate={handleNavigation}
      currentView={currentView}
      addCard={addCard}
      fields={form}
      isEditing={!!(formId && submissions !== null)}
      formId={formId}
    >
      {currentView === 'create' ? (
        <section className="relative flex flex-col h-full w-full md:max-w-[760px] mx-auto">
          <div className="flex-1 pt-3 px-3 md:px-0 pb-20 md:pb-8 w-full">
            <Reorder.Group
              axis="y"
              values={form}
              onReorder={handleReorder}
              className="flex flex-col gap-3 w-full"
            >
              {form.map((card, index) => (
                <Reorder.Item
                  key={card.id + index}
                  value={card}
                  id={card.id}
                  dragListener={
                    !isMobile && card.inputType !== InputTypes.TITLE
                  }
                  dragControls={dragControls}
                  transition={{ duration: 0 }}
                  className={isMobile ? 'cursor-default' : 'cursor-move'}
                >
                  <FormBuild
                    dragControls={dragControls}
                    isTitle={card.inputType === InputTypes.TITLE}
                    focusField={focusField}
                    fields={form}
                    typeChange={typeChange}
                    setTitle={setTitle}
                    removeCard={removeCard}
                    copyCard={copyCard}
                    toggleIsRequired={toggleIsRequired}
                    addEtcItem={addEtcItem}
                    addSelectItem={addSelectItem}
                    removeSelectItem={removeSelectItem}
                    setText={setText}
                    {...card}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        </section>
      ) : (
        <div className=" p-4 md:p-8">
          {submissions === null || submissions.length === 0 ? (
            <div className=" max-w-[500px] md:max-w-[760px]  mx-auto card bg-gray-100 dark:bg-transparent p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-600 dark:text-gray-300">
                {formId ? t('waitingForResponses') : t('noResponses')}
              </p>
            </div>
          ) : (
            <ResultForm submissions={submissions} />
          )}
        </div>
      )}
    </YiqiFormLayout>
  )
}

export default FormManager
