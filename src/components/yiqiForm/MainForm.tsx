'use client'
import React, { useEffect, useState } from 'react'
import FormBuild from './FormBuild'
import {
  FormProps,
  InputTypes,
  ItemTypeProps
} from '../../schemas/yiqiFormSchema'
import AddCardButton from './AddCardButton'
import YiqiFormLayout from './yiqiFormLayout'
import { usePathname, useRouter } from 'next/navigation'
import ResultForm from './ResultForm'
import { Reorder, useDragControls } from 'framer-motion'
import { generateUniqueId } from './utils'
import { translations } from '@/lib/translations/translations'

const initialCard = {
  id: 'TitleCard',
  cardTitle: translations.es.formWithoutTitle,
  inputType: InputTypes.TITLE,
  contents: '',
  isFocused: false,
  isRequired: false
}

function MainForm({ orgId }: { orgId: string }) {
  const [form, setForm] = useState<FormProps[]>([initialCard])
  const [isMobile, setIsMobile] = useState(false)

  const dragControls = useDragControls()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const [currentView, setCurrentView] = useState<'create' | 'results'>(
    pathname.includes('/results') ? 'results' : 'create'
  )

  const handleNavigation = (view: 'create' | 'results') => {
    setCurrentView(view)

    if (view === 'create') {
      router.push(`/admin/organizations/${orgId}/forms`)
    } else {
      router.push(`/admin/organizations/${orgId}/forms#responses`)
    }
  }

  // Helper Functions and field handler all
  const createNewCard = (cardId: string, cardTitle = ''): FormProps => ({
    id: cardId,
    cardTitle,
    inputType: InputTypes.RADIO,
    contents: [
      {
        id: generateUniqueId(),
        text: translations.es.option1
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
          newContents = [{ id: generateUniqueId(), text: 'Opción 1' }]
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
  console.log(form)
  return (
    <YiqiFormLayout
      form={form}
      orgId={orgId}
      onNavigate={handleNavigation}
      currentView={currentView}
    >
      {currentView === 'create' ? (
        <div className="relative flex flex-col md:flex-row h-full w-full max-w-[500px] md:max-w-[760px] mx-auto">
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
          <div className="hidden md:block md:ml-6 w-[60px] relative">
            <div className="sticky top-4">
              <AddCardButton addCard={addCard} fields={form} />
            </div>
          </div>
          <div className="md:hidden">
            <AddCardButton addCard={addCard} fields={form} />
          </div>
        </div>
      ) : (
        <ResultForm />
      )}
    </YiqiFormLayout>
  )
}

export default MainForm
