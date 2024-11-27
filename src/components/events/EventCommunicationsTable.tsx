import { useEffect, useState } from 'react'
import { NotificationSchemaType } from '@/schemas/notificationsSchema'
import { getEventNotifications } from '@/services/actions/notifications/getEventNotifications'
import { Table } from 'lucide-react'
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '../ui/table'

type Props = {
  eventId: string
}

export default function EventCommunicationsTable({ eventId }: Props) {
  const [communications, setCommunications] = useState<
    NotificationSchemaType[]
  >([])

  useEffect(() => {
    async function getList() {
      const results = await getEventNotifications(eventId)
      setCommunications(results)
    }
    getList()
  }, [eventId])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject</TableHead>
          <TableHead>Sent Date</TableHead>
          <TableHead>Sent to</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {communications.map(comm => (
          <TableRow key={comm.id}>
            <TableCell>{comm.type}</TableCell>
            <TableCell>{comm.sentAt}</TableCell>
            <TableCell>{comm.user.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
