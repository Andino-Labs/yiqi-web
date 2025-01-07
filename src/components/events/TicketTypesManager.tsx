'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Trash2 } from 'lucide-react'
import { EventTicketOfferingInputSchema } from '@/schemas/eventSchema'
import { z } from 'zod'
import { useTranslations } from 'next-intl'

const MAX_TICKETS = 5

type TicketType = z.infer<typeof EventTicketOfferingInputSchema>

const defaultTicket: TicketType = {
  category: 'GENERAL',
  description: '',
  name: '',
  price: 0,
  limit: 100,
  ticketsPerPurchase: 1
}

interface TicketTypesManagerProps {
  tickets?: TicketType[]
  onUpdate: (tickets: TicketType[]) => void
}

export function TicketTypesManager({
  tickets = [],
  onUpdate
}: TicketTypesManagerProps) {
  const t = useTranslations('TicketType')

  const [ticketList, setTicketList] = useState(tickets)

  const handleInputChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedTickets = ticketList.map((ticket, idx) =>
      idx === index ? { ...ticket, [field]: value } : ticket
    )
    setTicketList(updatedTickets)
  }

  const addTicket = () => {
    if (ticketList.length < MAX_TICKETS) {
      setTicketList([...ticketList, { ...defaultTicket }])
    }
  }

  const removeTicket = (index: number) => {
    const updatedTickets = ticketList.filter((_, idx) => idx !== index)
    setTicketList(updatedTickets)
  }

  const handleSubmit = () => {
    // Validation (optional): Validate against schema before submitting
    const result = z.array(EventTicketOfferingInputSchema).safeParse(ticketList)
    if (result.success) {
      onUpdate(ticketList)
    } else {
      console.error('Validation error:', result.error.issues)
    }
  }

  return (
    <div className="space-y-4">
      {ticketList.map((ticket, index) => (
        <div key={index} className="p-4 border rounded-lg relative pt-14">
          <Badge className="absolute left-2 top-2">{ticket.category}</Badge>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-400"
            onClick={() => removeTicket(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-2 gap-4">
            <FormItem>
              <FormLabel>{t('ticketName')}</FormLabel>
              <FormControl>
                <Input
                  value={ticket.name}
                  onChange={e =>
                    handleInputChange(index, 'name', e.target.value)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>{t('Category')}</FormLabel>
              <Select
                value={ticket.category}
                onValueChange={value =>
                  handleInputChange(index, 'category', value)
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCategory')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GENERAL">{t('General')}</SelectItem>
                  <SelectItem value="VIP">{t('VIP')}</SelectItem>
                  <SelectItem value="BACKSTAGE">{t('Backstage')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>{`${t('Price')} (Soles)`}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={ticket.price}
                  onChange={e =>
                    handleInputChange(
                      index,
                      'price',
                      parseFloat(e.target.value)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>{t('limit')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  value={ticket.limit}
                  onChange={e =>
                    handleInputChange(index, 'limit', parseInt(e.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>{t('ticketsPerPurchase')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  value={ticket.ticketsPerPurchase}
                  onChange={e =>
                    handleInputChange(
                      index,
                      'ticketsPerPurchase',
                      parseInt(e.target.value)
                    )
                  }
                />
              </FormControl>
              <FormDescription>{t('howMany')}</FormDescription>
              <FormMessage />
            </FormItem>

            <FormItem className="col-span-2">
              <FormLabel>{t('Description')}</FormLabel>
              <FormControl>
                <Input
                  value={ticket.description}
                  onChange={e =>
                    handleInputChange(index, 'description', e.target.value)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        </div>
      ))}

      {ticketList.length < MAX_TICKETS && (
        <Button type="button" variant="outline" onClick={addTicket}>
          {t('addTicketType')}
        </Button>
      )}

      <Button type="button" onClick={handleSubmit}>
        {t('saveTicketTYpe')}
      </Button>
    </div>
  )
}
