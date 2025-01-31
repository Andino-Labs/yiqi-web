'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import type { GetEventCustomFieldsResponse } from '@/services/actions/event/getEventCustomFields'

type ExportUserDataButtonProps = {
  data: GetEventCustomFieldsResponse
}

export function ExportUserDataButton({
  data
}: ExportUserDataButtonProps): JSX.Element {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState<boolean>(false)

  function exportToCSV(): void {
    setIsExporting(true)

    if (!data.success || !data.data || data.data.length === 0) {
      toast({
        title: 'Error',
        description: 'No hay datos para exportar.',
        variant: 'destructive'
      })
      setIsExporting(false)
      return
    }

    try {
      const csvRows: string[] = []
      const headers: string[] = Object.keys(data.data[0])
      csvRows.push(headers.join(','))

      for (const row of data.data) {
        const values: string[] = headers.map((header: string): string => {
          const cellValue: string =
            row[header] !== null && row[header] !== undefined
              ? String(row[header])
              : ''
          const escapedValue: string = cellValue.replace(/"/g, '""')
          return `"${escapedValue}"`
        })
        csvRows.push(values.join(','))
      }

      const csvString: string = csvRows.join('\n')
      const blob: Blob = new Blob([csvString], {
        type: 'text/csv;charset=utf-8;'
      })
      const link: HTMLAnchorElement = document.createElement('a')

      if (link.download !== undefined) {
        const url: string = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', 'datos_del_evento.csv')
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast({
          title: 'Éxito',
          description: 'Los datos se han exportado correctamente.'
        })
      }
    } catch (error) {
      console.error('Error al exportar CSV:', error)
      toast({
        title: 'Error',
        description:
          'Hubo un problema al exportar los datos. Por favor, inténtelo de nuevo.',
        variant: 'destructive'
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      variant={'secondary'}
      onClick={exportToCSV}
      disabled={
        isExporting || !data.success || !data.data || data.data.length === 0
      }
    >
      {isExporting ? 'Exportando...' : 'Exportar datos capturados como .csv'}
    </Button>
  )
}
