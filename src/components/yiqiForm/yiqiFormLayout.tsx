'use client'

import React from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { FormProps } from '../../schemas/yiqiFormSchema'
import { FormHeader } from './FormHeader'

function YiqiFormLayout({
  children,
  form,
  orgId,
  currentView,
  onNavigate
}: {
  children: React.ReactNode
  form: FormProps[]
  orgId: string
  currentView: 'create' | 'results'
  onNavigate: (view: 'create' | 'results') => void
}) {
  return (
    <div className="h-screen flex flex-col">
      <FormHeader
        form={form}
        orgId={orgId}
        currentView={currentView}
        onNavigate={onNavigate}
      />
      <ScrollArea className="flex-1 overflow-auto">{children}</ScrollArea>
    </div>
  )
}

export default YiqiFormLayout
