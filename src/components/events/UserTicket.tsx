'use client'

import { QRCodeSVG } from 'qrcode.react'
import { CalendarDays, Clock, User } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface TicketProps {
  ownerName: string
  eventName: string
  eventDate: string
  purchaseDate: string
  ticketId: string
  qrCodeData: string
}

export default function Component({
  ownerName = 'John Doe',
  eventName = 'Summer Music Festival',
  eventDate = '2023-07-15T20:00:00',
  purchaseDate = '2023-05-01',
  ticketId = 'TICKET-123-456-789',
  qrCodeData = `https://example.com/verify-ticket`
}: TicketProps) {
  const formattedEventDate = new Date(eventDate).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center">
          {eventName}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1 space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Ticket Holder
            </Label>
            <p className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              {ownerName}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Event Date
            </Label>
            <p className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              {formattedEventDate}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Purchase Date
            </Label>
            <p className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {new Date(purchaseDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1 flex justify-center items-center">
          <QRCodeSVG value={qrCodeData} size={150} />
        </div>
      </CardContent>
      <CardFooter className="bg-muted text-muted-foreground text-center text-sm rounded-b-lg">
        Ticket ID: {ticketId}
      </CardFooter>
    </Card>
  )
}
