import { getEventNotifications } from '@/services/actions/notifications/getEventNotifications'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '../ui/table'
import { getTranslations } from 'next-intl/server'

type Props = {
  eventId: string
}

export default async function EventCommunicationsTable({ eventId }: Props) {
  const t = await getTranslations('Event')
  const communications = await getEventNotifications(eventId)

  return (
    <Table>
      <TableHeader>
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
