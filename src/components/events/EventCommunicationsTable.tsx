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
import { useTranslations } from 'next-intl'

type Props = {
  eventId: string
}

export default function EventCommunicationsTable({ eventId }: Props) {
  const t = useTranslations('Event')
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
      <TableHeader className="bg-secondary">
        <TableRow>
          <TableHead>{t('Subject')}</TableHead>
          <TableHead>{t('date')}</TableHead>
          <TableHead>{t('sentTo')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {communications.map(comm => (
          <TableRow key={comm.id}>
            <TableCell>{comm.type}</TableCell>
            <TableCell>{comm.sentAt.toLocaleString()}</TableCell>
            <TableCell>{comm.user?.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
