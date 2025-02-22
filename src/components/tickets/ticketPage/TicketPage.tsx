'use client'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Ticket } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { QRModal } from '../qrModal/QrModal'
import { ticketEventSchemaType } from '@/schemas/ticketSchema'
import { translations } from '@/lib/translations/translations'
import { PaymentModal } from '../paymentModal/PaymentModal'
import NetworkingUsersList from '../networkingUsersList/NetworkingUsersList'
import { checkTicketCheckedIn } from '@/services/actions/tickets/checkTicketCheckedIn'
import { isOngoingEvent } from '@/lib/utils/isOngoingEvent'

interface TicketModalState {
  isOpen: boolean
  eventTitle: string
  attendeeName: string
  attendeeEmail: string
  ticketNumber: string
  eventId: string
  organizationId: string
  ticketId: string
  checkedInDate: string
}

const TicketStatusBadge = ({ status }: { status: string }) => {
  const badgeClass =
    status === 'APPROVED'
      ? 'bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20'
      : status === 'PENDING'
        ? 'bg-rose-500/10 text-rose-200 hover:bg-rose-500/20'
        : 'bg-rose-500/10 text-rose-200 hover:bg-rose-500/20'

  const badgeText =
    status === 'APPROVED'
      ? translations.es.ticketStatusApproved
      : status === 'PENDING'
        ? translations.es.ticketStatusPending
        : translations.es.ticketStatusRejected

  return (
    <Badge
      variant={
        status === 'APPROVED'
          ? 'default'
          : status === 'PENDING'
            ? 'secondary'
            : 'destructive'
      }
      className={badgeClass}
    >
      {badgeText}
    </Badge>
  )
}

export default function TicketsPage({
  tickets,
  userHasNetworkingData
}: {
  tickets: ticketEventSchemaType
  userHasNetworkingData: boolean
}) {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [modalState, setModalState] = useState<TicketModalState>({
    isOpen: false,
    eventTitle: '',
    attendeeName: '',
    attendeeEmail: '',
    ticketNumber: '',
    eventId: '',
    organizationId: '',
    ticketId: '',
    checkedInDate: ''
  })

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const totalPages = Math.ceil(tickets.length / itemsPerPage)
  const currentTickets = tickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }
  const [isMatchesModalVisible, setIsMatchesModalVisible] =
    useState<boolean>(false)

  useEffect(() => {
    if (
      !userHasNetworkingData ||
      !modalState.isOpen ||
      !modalState.ticketId ||
      modalState.checkedInDate !== null
    ) {
      return
    }

    const intervalId = setInterval(async () => {
      try {
        // Fetch ticket check-in status
        const response = await checkTicketCheckedIn(modalState.ticketId)
        const updatedCheckedInDate = response.checkedInDate || null

        if (updatedCheckedInDate) {
          // Close QR modal and open Networking modal
          setModalState(prev => ({ ...prev, isOpen: false }))
          setIsMatchesModalVisible(true)
          clearInterval(intervalId)
        }
      } catch (error) {
        console.error('Error checking ticket status:', error)
      }
    }, 5000)

    return () => clearInterval(intervalId)
  }, [modalState, userHasNetworkingData])

  const openModal = (
    eventTitle: string,
    attendeeName: string,
    attendeeEmail: string,
    ticketNumber: string,
    eventId: string,
    organizationId: string,
    ticketId: string,
    checkedInDate: string
  ) => {
    setModalState({
      isOpen: true,
      eventTitle,
      attendeeName,
      attendeeEmail,
      ticketNumber,
      eventId,
      organizationId,
      ticketId,
      checkedInDate
    })
  }

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <main className="max-w-5xl mx-auto sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            {tickets.length === 0
              ? translations.es.ticketNo
              : translations.es.ticketTitlePage}
          </h1>
          <div className="space-y-8">
            {currentTickets.map(data => (
              <Card
                key={data.event.id}
                className="group bg-zinc-900/60 border-zinc-800/50 shadow-lg transition hover:bg-zinc-900/80 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3 text-sm text-zinc-400">
                        <time>
                          {new Date(data.event.startDate).toLocaleDateString()}{' '}
                          - {new Date(data.event.endDate).toLocaleDateString()}
                        </time>
                      </div>
                      <h2 className="text-white text-2xl font-semibold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-zinc-300">
                        {data.event.title}
                      </h2>
                      <div className="flex items-center gap-3 mt-2">
                        <Avatar className="w-8 h-8 border border-zinc-800">
                          <AvatarImage src={data.event.organization.logo} />
                        </Avatar>
                        <span className="text-zinc-400">
                          {data.event.organization.name}
                        </span>
                      </div>
                    </div>

                    <div className="w-full lg:w-auto">
                      <Image
                        src={data.event.openGraphImage}
                        alt={translations.es.ticketEventImageAlt}
                        width={600}
                        height={100}
                        className="relative rounded-xl border border-zinc-800/50 w-full h-60 lg:w-72 lg:h-40 object-cover"
                      />
                    </div>
                  </div>
                  {isOngoingEvent(data.event.startDate, data.event.endDate) &&
                  userHasNetworkingData ? (
                    <NetworkingUsersList
                      registrationId={data.tickets[0].registrationId}
                      isModalVisible={isMatchesModalVisible}
                      setIsModalVisible={setIsMatchesModalVisible}
                    />
                  ) : null}
                  <div className="mt-6 space-y-4">
                    {data.tickets.map((ticket, index) => (
                      <div
                        key={ticket.id}
                        className="flex flex-col sm:flex-row sm:justify-between items-center border-t border-zinc-800 pt-4 gap-4 sm:gap-0"
                      >
                        <div className="flex gap-5">
                          <Badge className="bg-zinc-800/50 border border-zinc-700">
                            {translations.es.ticketNumber}
                            {index + 1} {ticket.category}
                          </Badge>
                          <TicketStatusBadge status={ticket.status} />
                        </div>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 bg-white/5 border-zinc-700 hover:bg-white/10 text-white hover:text-white"
                          onClick={() => {
                            if (
                              ticket.registration.paymentId &&
                              !ticket.registration.paid
                            ) {
                              setModalState(prev => ({
                                ...prev,
                                eventId: data.event.id,
                                organizationId: data.event.organizationId
                              }))
                              setPaymentModalOpen(true)
                            } else {
                              openModal(
                                data.event.title,
                                ticket.registration.customFields?.name || 'N/A',
                                ticket.registration.customFields?.email ||
                                  'N/A',
                                (index + 1).toString(),
                                data.event.id,
                                data.event.organizationId,
                                ticket.id,
                                ticket.checkedInDate
                                  ? ticket.checkedInDate.toString()
                                  : ''
                              )
                            }
                          }}
                          disabled={['PENDING', 'REJECTED'].includes(
                            ticket.status
                          )}
                        >
                          <Ticket className="w-4 h-4" />
                          {translations.es.ticketLabelView}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {tickets.length > 0 && (
            <div className="flex justify-center items-center mt-6 space-x-4">
              <Button
                variant="outline"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-white">
                Pagina {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </main>
      </Card>

      <QRModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        eventTitle={modalState.eventTitle}
        attendeeName={modalState.attendeeName}
        attendeeEmail={modalState.attendeeEmail}
        ticketNumber={modalState.ticketNumber}
        eventId={modalState.eventId}
        organizationId={modalState.organizationId}
        ticketId={modalState.ticketId}
        checkedInDate={modalState.checkedInDate}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        eventId={modalState.eventId}
      />
    </>
  )
}
