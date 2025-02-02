'use client'
import { BulkSendModal } from '@/components/chat/BulkSendModal'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRef } from 'react'

export function ChatSection({
  orgId,
  isActive,
  children
}: {
  orgId: string
  isActive: boolean
  children: React.ReactNode
}) {
  const dialogTriggerRef = useRef<HTMLButtonElement | null>(null)
  const tChat = useTranslations('Chat')
  const tBulk = useTranslations('BulkSend')

  const handleBulkSendClick = () => {
    if (dialogTriggerRef?.current) {
      dialogTriggerRef.current.click()
    }
  }

  return (
    <div>
      <div className="mb-4 text-right">
        <Button
          variant="outline"
          className="font-bold"
          onClick={handleBulkSendClick}
        >
          {tBulk('bulkSendButton')}
        </Button>
      </div>

      {!isActive ? (
        <div>
          <div className="flex items-center justify-between sm:justify-end hidden">
            <div className="w-full flex justify-start mb-4 hidden">
              <h1 className="text-lg font-semibold">{tChat('chats')}</h1>
            </div>
            <div className="w-full flex justify-end mb-4">
              <BulkSendModal
                dialogTriggerRef={dialogTriggerRef}
                allowedMessageTypes={['email']}
              />
            </div>
          </div>
          {children}
        </div>
      ) : (
        <div>
          <div className="sm:justify-end sm:hidden">
            <div className="w-full flex justify-start gap-2">
              <Link
                href={`/admin/organizations/${orgId}/chat`}
                className="sm:hidden flex items-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-lg font-semibold">{tChat('chats')}</h1>
            </div>
            <div className="w-full flex justify-end mb-4">
              <BulkSendModal
                dialogTriggerRef={dialogTriggerRef}
                allowedMessageTypes={['email']}
              />
            </div>
          </div>
          {children}
        </div>
      )}
    </div>
  )
}
