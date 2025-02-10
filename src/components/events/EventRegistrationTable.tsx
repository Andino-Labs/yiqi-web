/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Check, X, Download } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'
import { Button } from '../ui/button'
import { updateRegistrationStatus } from '@/services/actions/event/updateRegistrationStatus'
import {
  AttendeeStatus,
  type EventRegistrationsSchemaType
} from '@/schemas/eventSchema'
import { useTranslations } from 'next-intl'

type CustomFieldsData = Record<string, string | number | boolean>

interface ExtendedEventRegistrationsSchemaType
  extends EventRegistrationsSchemaType {
  customFieldsData?: CustomFieldsData
}

function parseCustomFields(data: any): CustomFieldsData {
  try {
    let parsedData: any = data

    if (typeof parsedData === 'string') {
      parsedData = JSON.parse(parsedData)
    }

    // Extract customFieldsData if present
    if (
      parsedData &&
      typeof parsedData === 'object' &&
      'customFieldsData' in parsedData
    ) {
      parsedData = parsedData.customFieldsData
    }

    const result: CustomFieldsData = {}

    const extractFields = (obj: Record<string, any>, prefix = ''): void => {
      for (const [key, value] of Object.entries(obj)) {
        // Skip technical fields at any level
        if (['name', 'email', 'tickets'].includes(key)) continue

        if (
          typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value)
        ) {
          extractFields(value, `${prefix}${key}_`)
        } else {
          result[`${prefix}${key}`] = value
        }
      }
    }

    if (
      parsedData &&
      typeof parsedData === 'object' &&
      !Array.isArray(parsedData)
    ) {
      extractFields(parsedData)
    }

    return result
  } catch (error) {
    console.error('Error parsing custom fields:', error)
    return {}
  }
}

function getUniqueCustomFields(
  registrations: ExtendedEventRegistrationsSchemaType[]
): string[] {
  const allFields = new Set<string>()
  registrations.forEach(registration => {
    if (registration.customFieldsData) {
      Object.keys(registration.customFieldsData).forEach(key => {
        allFields.add(key)
      })
    }
  })
  return Array.from(allFields)
}

function exportToCSV(
  registrations: ExtendedEventRegistrationsSchemaType[],
  customFields: string[]
): void {
  const headers = ['Name', 'Email', 'Status', ...customFields]
  const csvContent = registrations.map(
    ({ user: attendee, status, customFieldsData }) => {
      const row = [attendee.name, attendee.email, status]
      customFields.forEach(field => {
        row.push(
          customFieldsData && customFieldsData[field] != null
            ? String(customFieldsData[field])
            : ''
        )
      })
      return row.join(',')
    }
  )

  const csv = [headers.join(','), ...csvContent].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'event_registrations.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export default function EventRegistrationTable({
  registrations
}: {
  registrations: ExtendedEventRegistrationsSchemaType[]
}) {
  const t = useTranslations('DeleteAccount')

  // Mutate registrations array to add customFieldsData
  registrations.forEach(registration => {
    registration.customFieldsData = parseCustomFields(registration.customFields)
  })

  const customFields = getUniqueCustomFields(registrations)

  function handleApproval(
    registrationId: string,
    status: 'APPROVED' | 'REJECTED'
  ): void {
    updateRegistrationStatus(registrationId, status)
  }

  function handleExport(): void {
    exportToCSV(registrations, customFields)
  }

  return (
    <div>
      <Button onClick={handleExport} className="mb-4" variant={'secondary'}>
        <Download className="w-4 h-4 mr-2" /> Exporta como csv
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('email')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            {customFields.map(field => (
              <TableHead key={field}>{field}</TableHead>
            ))}
            <TableHead>{t('action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map(
            ({ user: attendee, status, id, customFieldsData }) => (
              <TableRow key={id}>
                <TableCell>{attendee.name}</TableCell>
                <TableCell>{attendee.email}</TableCell>
                <TableCell>{status}</TableCell>
                {customFields.map(field => (
                  <TableCell key={field}>
                    {customFieldsData && customFieldsData[field] != null
                      ? String(customFieldsData[field])
                      : ''}
                  </TableCell>
                ))}
                <TableCell>
                  {status !== AttendeeStatus.APPROVED && (
                    <Button
                      onClick={function () {
                        handleApproval(id, 'APPROVED')
                      }}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Check className="w-4 h-4 mr-1" /> {t('approve')}
                    </Button>
                  )}
                  {status !== AttendeeStatus.REJECTED && (
                    <Button
                      onClick={function () {
                        handleApproval(id, 'REJECTED')
                      }}
                      size="sm"
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <X className="w-4 h-4 mr-1" /> {t('reject')}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  )
}
