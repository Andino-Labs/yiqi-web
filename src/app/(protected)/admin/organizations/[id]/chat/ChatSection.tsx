'use client'
import { BulkSendModal } from '@/components/chat/BulkSendModal'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { LuciaUserType } from '@/schemas/userSchema'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRef } from 'react'

export function ChatSection({
  orgId,
  user,
  isActive,
  children
}: {
  orgId: string
  user: LuciaUserType
  isActive: boolean
  children: React.ReactNode
}) {
  const dialogTriggerRef = useRef<HTMLButtonElement | null>(null)
  const tChat = useTranslations('Chat')
  const tBulk = useTranslations('BulkSend')

  return (
    <OrganizationLayout
      orgId={orgId}
      userProps={{
        picture: user.picture!,
        email: user.email,
        name: user.name,
        id: user.id
      }}
      showExtraButton={true}
      buttonName={tBulk('bulkSendButton')}
      dialogTriggerRef={dialogTriggerRef}
    >
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
    </OrganizationLayout>
  )
}
