import { SavedTicketOfferingType } from '@/schemas/eventSchema'
import { useTranslations } from 'next-intl'

interface RegistrationSummaryProps {
  tickets: SavedTicketOfferingType[]
  ticketSelections: Record<string, number>
  calculateTotal: () => number
}

export function RegistrationSummary({
  tickets,
  ticketSelections,
  calculateTotal
}: RegistrationSummaryProps) {
  const t = useTranslations('RegistrationComponent')
  return (
    <div className="space-y-4">
      <h3 className="font-medium">{t('eventRegistrationSummary')}</h3>
      <div className="space-y-2">
        {tickets.map(ticket => {
          const quantity = ticketSelections[ticket.id] || 0
          if (quantity === 0) return null
          return (
            <div key={ticket.id} className="flex justify-between">
              <span>{`${quantity}x ${ticket.name}`}</span>
              <span>
                {ticket.price === 0
                  ? `${t('eventFree')}`
                  : `S/ ${(ticket.price * quantity).toFixed(2)}`}
              </span>
            </div>
          )
        })}
        <div className="border-t pt-2 font-medium flex justify-between">
          <span>{t('eventTotal')}</span>
          <span>{`S/ ${calculateTotal().toFixed(2)}`}</span>
        </div>
      </div>
    </div>
  )
}
