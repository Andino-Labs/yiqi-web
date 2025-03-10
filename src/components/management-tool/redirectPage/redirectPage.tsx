'use client'

import { createTwitterAccount } from '@/services/actions/management-tool/channels/twitter/createTwitterAccount'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
  id: string
}

export default function RedirectPage({ user }: { user: User }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [storedOrgId, setStoredOrgId] = useState<string | null>(null)
  const router = useRouter()
  const t = useTranslations('ManagementTool')

  useEffect(() => {
    const orgId = localStorage.getItem('orgId')
    setStoredOrgId(orgId)
  }, [])

  useEffect(() => {
    const processTwitterAccount = async () => {
      if (!storedOrgId) return

      const params = new URLSearchParams(window.location.search)
      const accessToken = params.get('accessToken')
      const accessTokenSecret = params.get('accessTokenSecret')
      const twitterUserId = params.get('userId')
      const screenName = params.get('screenName')

      if (accessToken && accessTokenSecret && twitterUserId) {
        try {
          setSuccess(true)

          await createTwitterAccount({
            userIdApp: user.id,
            organizationId: storedOrgId,
            accountId: twitterUserId,
            accessToken,
            accessTokenSecret,
            userId: twitterUserId,
            screenName: screenName || ''
          })

          router.push(`/admin/organizations/${storedOrgId}/management-tool`)
        } catch (err) {
          console.error('Error creating Twitter account:', err)
          setError('Error connecting to API.')
        }
      } else {
        setError('Missing parameters in URL.')
      }
    }

    processTwitterAccount()
  }, [storedOrgId, router, user])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {success ? (
        <h2 className="text-green-500 font-bold text-2xl">
          {t('successfullRedirect')}
        </h2>
      ) : error ? (
        <h2 className="text-red-500 font-bold text-2xl">
          {t('errorRedirect')}
        </h2>
      ) : (
        <h2 className="text-blue-500 font-bold text-2xl">
          {t('inProcessRedirect')}
        </h2>
      )}
    </div>
  )
}
