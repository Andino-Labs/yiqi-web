'use client'

import { SearchUser } from '@/services/giftTicket/searchUser'
import { Input } from '../ui/input'
import { useState } from 'react'
import Image from 'next/image'
import { EllipsisVertical, Loader2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '../ui/button'

import giftTicket from '@/services/giftTicket/createRegistration'
import { LuciaUserType } from '@/schemas/userSchema'
import { RegistrationInput } from '@/schemas/eventSchema'

import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '../ui/toast'



export interface SearchResults {
  name: string | undefined
  email: string | undefined
  id: string | undefined
  picture: string | undefined | null
}

export default function GiftTicket(props: { eventId: string | undefined }) {
  const [results, setResults] = useState<SearchResults[]>([])
  const [searchTerm, setSearchTerm] = useState('')

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
        <h2 className="text-xl font-semibold mb-2">Gift Ticket</h2>
        <p className="text-muted-foreground">
          You can easily give out free tickets to people by simply searching
          their name or email address
        </p>
      </div>

      {/* form */}
      <div className="flex flex-col space-y-3">
        <div className="flex justify-start flex-col">
          <label htmlFor="search">Search</label>
          <Input
            type="text"
            placeholder="search username or email"
            onChange={e => search(e.target.value)}
          />
        </div>

        {searchTerm && results && results.length > 0 && (
          <div>
            <h3 className="font-semibold mt-3">Search Results</h3>
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
                  <GiftUser
                    userName={result.name}
                    email={result.email}
                    picture={result.picture as string}
                    userId={result.id}
                    eventId={props.eventId as string}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No Results */}
        {searchTerm && results && results.length === 0 && (
          <p className="text-sm text-muted-foreground mt-3">
            No users found matching {searchTerm}.
          </p>
        )}
      </div>
    </div>
  )
}

// modal for registered user

function GiftUser(props: {
  userName: string | undefined
  userId: string | undefined
  email: string | undefined
  eventId: string | undefined
  picture: string | undefined
}) {

  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const contextUser: LuciaUserType = {
    email: props.email as string,
    id: props.userId as string,
    name: props.userName as string,
    picture: props.picture as string,
    role: "USER"
  }

  const eventId = props.eventId as string

  const registrationInput: RegistrationInput = {
    email: props.email as string,
    name: props.userName as string,
    tickets: { "VIP": 1 }
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <EllipsisVertical className="stroke-accent-foreground cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle className="flex space-x-3">
            {`Gift a ticket to ${props.userName}`}
          </DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&#39;re done.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start">
          <Button
            type="submit"
            onClick={() => async function submit() {
              setLoading(true)
              try {
                await giftTicket(contextUser, eventId, registrationInput)
                setLoading(false)

                toast({
                  title: "Gift Ticket sent! ",
                  description: `Your ticket has successfully been gifted to ${props.userName}`,
                  action: (
                    <ToastAction altText="Goto schedule to undo">ok</ToastAction>
                  ),
                })
              } catch (error) {
                console.log(error)
                toast({
                  title: "Unable to send gift Ticket! ",
                  description: `An error occured while sending the gift ticket to ${props.userName}`,
                  action: (
                    <ToastAction altText="Goto schedule to undo">ok</ToastAction>
                  ),
                })
              }
            }}
          >
            {loading === true ? (
              'Gift Ticket'
            ) : (
              <Loader2 className="animate-spin" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
