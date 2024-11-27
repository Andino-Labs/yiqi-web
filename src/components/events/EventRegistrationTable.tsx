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
import { translations } from '@/lib/translations/translations'

export default function EventRegistrationTable({
  registrations
}: {
  registrations: EventRegistrationsSchemaType[]
}) {
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
          <TableHead>{translations.es.name}</TableHead>
          <TableHead>{translations.es.email}</TableHead>
          <TableHead>{translations.es.status}</TableHead>
          <TableHead>{translations.es.action}</TableHead>
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
                  <Check className="w-4 h-4 mr-1" /> {translations.es.approve}
                </Button>
              )}

              {status !== AttendeeStatus.REJECTED && (
                <Button
                  onClick={() => handleApproval(id, 'REJECTED')}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600"
                >
                  <X className="w-4 h-4 mr-1" /> {translations.es.reject}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
