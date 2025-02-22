import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { EventRegistrationSchemaType } from '@/schemas/eventSchema'
import { Check, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import StripeCheckout from '@/components/billing/StripeCheckout'
import { useState } from 'react'
import { markRegistrationPaid } from '@/services/actions/event/markRegistrationPaid'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { LuciaUserType } from '@/schemas/userSchema'

interface RegistrationConfirmationProps {
  registration: EventRegistrationSchemaType
  requiresPayment?: boolean
  isLoggedIn: boolean
  user?: LuciaUserType
}

export function RegistrationConfirmation({
  registration,
  requiresPayment = false,
  isLoggedIn
}: RegistrationConfirmationProps) {
  const router = useRouter()
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)

  const t = useTranslations('RegistrationComponent')
  const handlePaymentComplete = async () => {
    const result = await markRegistrationPaid(registration.id)
    if (result.success) {
      toast({
        title: `${t('eventRegistrationSuccess')}`,
        variant: 'default'
      })
      setIsPaymentDialogOpen(false)

      if (isLoggedIn) {
        router.push('/user/tickets')
      }
    } else {
      toast({
        title: `${t('eventRegistrationError')}`,
        variant: 'destructive'
      })
    }
  }

  // Show payment pending state
  if (requiresPayment && !registration.paid) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="text-center">
            {t('registrationPaymentPending')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('registrationPaymentPendingDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog
            open={isPaymentDialogOpen}
            onOpenChange={setIsPaymentDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full">
                {t('registrationContinuePayment')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <StripeCheckout
                registrationId={registration.id}
                onComplete={handlePaymentComplete}
              />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    )
  }

  // Show success state
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-center">
          {registration.status === 'PENDING'
            ? `${t('registrationPending')}`
            : `${t('registrationConfirmed')}`}
        </CardTitle>
        <CardDescription className="text-center">
          {registration.status === 'PENDING'
            ? `${t('registrationPendingDescription')}`
            : `${t('registrationConfirmedDescription')}`}
        </CardDescription>
      </CardHeader>
      {registration.status === 'APPROVED' && (
        <CardContent className="space-y-4">
          <div className="text-center">
            {isLoggedIn ? (
              <Link href="/user/tickets">
                <Button>{t('viewMyTickets')}</Button>
              </Link>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t('loginToViewTickets')}
                </p>
                <Link href="/login">
                  <Button className="w-full">{t('loginToContinue')}</Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
