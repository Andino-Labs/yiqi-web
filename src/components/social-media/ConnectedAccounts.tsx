import React from 'react'
import { Button } from '@/components/ui/button'
import { SocialMediaAccount } from '@prisma/client'
import { disconnectAccount } from '@/services/actions/socialMediaActions'

interface ConnectedAccountsProps {
  accounts: SocialMediaAccount[]
  organizationId: string
}

export function ConnectedAccounts({
  accounts,
  organizationId
}: ConnectedAccountsProps) {
  const handleDisconnect = async (accountId: string) => {
    try {
      await disconnectAccount(accountId, organizationId)
      // You might want to refresh the accounts list here or use some state management
    } catch (error) {
      console.error('Failed to disconnect account:', error)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Connected Accounts</h2>
      {accounts.length === 0 ? (
        <p>No connected accounts.</p>
      ) : (
        <ul>
          {accounts.map(account => (
            <li
              key={account.id}
              className="flex items-center justify-between mb-2"
            >
              <span>
                {account.platform}: {account.accountName}
              </span>
              <Button
                onClick={() => handleDisconnect(account.id)}
                variant="destructive"
              >
                Disconnect
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
