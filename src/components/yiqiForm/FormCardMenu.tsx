'use client'

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'

import { deleteForm } from '@/services/actions/typeForm/typeFormActions'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface FormCardMenuProps {
  formId: string
}

export function FormCardMenu({ formId }: FormCardMenuProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      const response = await deleteForm(formId)
      if (response.success) {
        toast({
          description: 'Formulario eliminado',
          variant: 'default'
        })
        router.refresh()
      } else {
        toast({
          description: 'Error al eliminar el formulario',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        description: 'Error al eliminar el formulario',
        variant: 'destructive'
      })
      console.error('Error:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute bottom-2 right-2 z-10">
        <MoreVertical className="h-5 w-5 text-gray-400 hover:text-gray-200" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={handleDeleteClick}
          className="text-red-500 focus:text-red-500"
        >
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FormCardMenu