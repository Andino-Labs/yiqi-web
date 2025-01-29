'use client'

import React from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { FormProps } from '../../schemas/yiqiFormSchema'
import { FormHeader } from './FormHeader'

interface YiqiFormLayoutProps {
  children: React.ReactNode
  form: FormProps[]
  orgId: string
  currentView: 'create' | 'results'
  onNavigate: (view: 'create' | 'results') => void
  fields: FormProps[]
  addCard: (
    focusedCardIndex: number,
    cardId: string,
    cardTitle?: string
  ) => void
  isEditing: boolean
  formId?: string
}
export function YiqiFormLayout({
  children,
  form,
  orgId,
  currentView,
  onNavigate,
  fields,
  addCard,
  isEditing,
  formId
}: YiqiFormLayoutProps) {
  return (
    <div className="dark:bg-[rgb(28, 28, 28)] relative ">
      <FormHeader
        form={form}
        orgId={orgId}
        currentView={currentView}
        onNavigate={onNavigate}
        addCard={addCard}
        fields={fields}
        isEditing={isEditing}
        formId={formId}
      />
      <ScrollArea
        style={{
          position: 'absolute',
          height: 'calc(100vh - 104px)',
          width: '100%'
        }}
      >
        {children}
      </ScrollArea>
    </div>
  )
}

export default YiqiFormLayout
