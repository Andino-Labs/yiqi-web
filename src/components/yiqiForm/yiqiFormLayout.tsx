'use client'

import React from 'react'

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
    <div className="w-full h-full flex flex-col">
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
      {children}
    </div>
  )
}

export default YiqiFormLayout
