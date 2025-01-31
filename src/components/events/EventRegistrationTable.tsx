'use client'
import { Check, X } from 'lucide-react'
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
  EventRegistrationsSchemaType
} from '@/schemas/eventSchema'
import { useTranslations } from 'next-intl'

export default function EventRegistrationTable({
  registrations
}: {
  registrations: EventRegistrationsSchemaType[]
}) {
  const t = useTranslations('DeleteAccount')
  async function handleApproval(
    registrationId: string,
    status: 'APPROVED' | 'REJECTED'
  ) {
    await updateRegistrationStatus(registrationId, status)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('name')}</TableHead>
          <TableHead>{t('email')}</TableHead>
          <TableHead>{t('status')}</TableHead>
          <TableHead>{t('action')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.map(({ user: attendee, status, id }) => (
          <TableRow key={attendee.id}>
            <TableCell>{attendee.name}</TableCell>
            <TableCell>{attendee.email}</TableCell>
            <TableCell>{status}</TableCell>
            <TableCell>
              {status !== AttendeeStatus.APPROVED && (
                <Button
                  onClick={() => handleApproval(id, 'APPROVED')}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Check className="w-4 h-4 mr-1" /> {t('approve')}
                </Button>
              )}

              {status !== AttendeeStatus.REJECTED && (
                <Button
                  onClick={() => handleApproval(id, 'REJECTED')}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600"
                >
                  <X className="w-4 h-4 mr-1" /> {t('reject')}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
