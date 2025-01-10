'use client'

import { Input } from '../ui/input'
import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { GiftUnregisteredUser } from './giftUnregisteredUser'
import { SavedEventType } from '@/schemas/eventSchema'
import { SearchUser } from '@/services/giftTicket/searchUser'
import { GiftUser } from './giftRegisteredUser'

export interface SearchResults {
  name: string | undefined
  email: string | undefined
  id: string | undefined
  picture: string | undefined | null
} // this interface is used to determine the data to be pulled from the search results.

export default function GiftTicket(props: {
  eventId: string | undefined
  event: SavedEventType // this savedEventType is gotten from the getEvent.ts. Since the Promise of the server action is of this type, it is logical to use it as the type for the event here it is also the same type that is gotten on the parent page.tsx
  senderName: string | undefined
}) {
  const [results, setResults] = useState<SearchResults[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const t = useTranslations('Gift')

  async function search(value: string) {
    setSearchTerm(value)
    if (value.trim() === '') {
      setResults([]) // Clear results if search input is empty
      return
    }
    const search = await SearchUser(value)
    setResults(search)
  }
  return (
    <div className="flex flex-col space-y-3">
      {/* title and description */}
      <div className="">
        <h2 className="text-xl font-semibold mb-2">{t('gift')}</h2>
        <p className="text-muted-foreground">{t('giftBody')}</p>
      </div>

      {/* form */}
      <div className="flex flex-col space-y-3">
        <div className="flex justify-start flex-col">
          <label htmlFor="search">{t('Search')}</label>
          <Input
            type="text"
            placeholder="search username or email"
            onChange={e => search(e.target.value)}
          />
        </div>

        {searchTerm && results && results.length > 0 && (
          <div>
            <h3 className="font-semibold mt-3">{t('results')}</h3>
            <ul className="space-y-2 w-full bg-accent/60 p-5 rounded-2xl">
              {results.map((result, index) => (
                <li
                  key={index}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {result.picture && (
                      <div className="w-10 h-10 rounded-full relative">
                        <Image
                          src={result.picture}
                          alt={result.name || 'User'}
                          className="object-cover rounded-full"
                          fill
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{result.name || 'No Name'}</p>
                      <p className="text-sm text-muted-foreground">
                        {result.email}
                      </p>
                    </div>
                  </div>
                  {/* modal for registered user: if the search terms matches with any user's details in the db, this modal will be displayed */}
                  <GiftUser
                    userName={result.name}
                    email={result.email}
                    picture={result.picture as string}
                    userId={result.id}
                    eventId={props.eventId as string}
                    event={props.event!}
                    senderName={props.senderName}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No Results */}
        {searchTerm && results && results.length === 0 && (
          <div className="w-full flex items-center justify-center">
            <div className="flex flex-col space-y-2 justify-center">
              <p className="text-sm text-muted-foreground mt-3 text-center">
                {t('noResults', { searchTerm })}.
              </p>

              {/* modal for unregistered users: if the search terms does not match with any user in the db, we can assume that the user does not exist(does not have an account). this modal enables the admin to create an account for the user then it calls the server action that creates tickets */}
              <GiftUnregisteredUser
                searchTerm={searchTerm as string}
                event={props.event!}
                eventId={props.eventId}
                senderName={props.senderName}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
