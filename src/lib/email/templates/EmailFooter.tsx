import { Text, Link, Hr } from '@react-email/components'
import { ReactElement } from 'react'
import { generateOptOutToken } from '@/lib/auth/optOut'

interface EmailFooterProps {
  userId: string
  userEmail: string
}

export function EmailFooter({
  userId,
  userEmail
}: EmailFooterProps): ReactElement {
  const optOutToken = generateOptOutToken(userId, userEmail)
  const optOutUrl = `${process.env.NEXT_PUBLIC_APP_URL}/opt-out?token=${optOutToken}`

  return (
    <>
      <Hr className="border-gray-300 my-4" />
      <Text className="text-sm text-gray-500 mb-2">
        Andino Inc.
        <br />
        123 Main Street, Suite 100
        <br />
        San Francisco, CA 94105
      </Text>
      <Text className="text-xs text-gray-400">
        You received this email because you are subscribed to Andino
        communications.{' '}
        <Link href={optOutUrl} className="text-blue-500 underline">
          Unsubscribe
        </Link>
      </Text>
    </>
  )
}
