'use client'

import { useState } from 'react'
import { createOrganizer } from '@/services/actions/organizerActions'
import { searchUsers } from '@/services/actions/userActions'
import { useRouter } from 'next/navigation'
import { User } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function AddOrganizerButton({
  organizationId
}: {
  organizationId: string
}) {
  const t = useTranslations('AddOrganizer')
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [role, setRole] = useState<'ADMIN' | 'VIEWER'>('VIEWER')
  const router = useRouter()

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      const results = await searchUsers(query)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    setSearchQuery('')
    setSearchResults([])
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedUser) {
      setError(`${t('selectUserError')}`)
    }

    try {
      await createOrganizer({ userId: selectedUser?.id, organizationId, role })
      setShowForm(false)
      setError('')
      router.refresh()
    } catch (error) {
      console.error(error)
      setError(`${t('addOrganizerError')}`)
    }
  }

  return (
    <div className="dark:bg-primary ml-auto">
      <Button
        className="w-70% dark:bg-neutral-600 font-bold"
        onClick={() => setShowForm(true)}
      >
        {t('addOrganizer')}
      </Button>
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="dark:bg-primary p-4 rounded shadow-lg w-96"
          >
            <h2 className="text-xl font-bold mb-4">{t('addNewOrganizer')}</h2>
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder={t('searchUsers')}
                className="w-full p-2 border rounded"
              />
              {searchResults.length > 0 && (
                <ul className="mt-2 border rounded max-h-40 overflow-y-auto">
                  {searchResults.map(user => (
                    <li
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="p-2 hover:bg-opposite hover:text-opposite cursor-pointer"
                    >
                      {user.name} ({user.email})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {selectedUser && (
              <div className="mb-4">
                <p>
                  {t('selectedUser')}: {selectedUser.name} ({selectedUser.email}
                  )
                </p>
              </div>
            )}

            <Select
              value={role}
              onValueChange={value => setRole(value as 'ADMIN' | 'VIEWER')}
            >
              <SelectTrigger className="w-full bg-transparent text-white">
                <SelectValue
                  className="bg-transparent text-white"
                  placeholder="Select one type"
                />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-none text-white">
                <SelectItem
                  className="focus:bg-accent/35 focus:text-[#61f1f8]"
                  value="VIEWER"
                >
                  {t('viewer')}
                </SelectItem>
                <SelectItem
                  className="focus:bg-accent/35 focus:text-[#61f1f8]"
                  value="ADMIN"
                >
                  {t('admin')}
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                type="button"
                className="w-70% dark:bg-transparent border border-white font-bold"
                onClick={() => setShowForm(false)}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                className="w-70% dark:bg-neutral-600 font-bold"
                onClick={() => setShowForm(true)}
              >
                {t('add')}
              </Button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>
      )}
    </div>
  )
}
