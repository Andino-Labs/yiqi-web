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

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Form } from '@/components/ui/form'
import giftTicket from '@/services/giftTicket/createRegistration'

const formSchema = z.object({
    contextUser: z.object({
        role: z.enum(['USER', 'ADMIN', 'ANDINO_ADMIN', 'NEW_USER']),
        id: z.string(),
        name: z.string(),
        email: z.string(),
        picture: z.string().nullable()
    }),
    eventId: z.string(),
    registrationData: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        tickets: z.record(z.string(), z.number().min(0).max(5))
    })
})

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
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    const [loading, setLoading] = useState<boolean>(false)

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            // contextUser values
            form.setValue('contextUser.role', 'USER')
            form.setValue('contextUser.id', props.userId as string)
            form.setValue('contextUser.name', props.userName as string)
            form.setValue('contextUser.email', props.email as string)
            form.setValue('contextUser.picture', props.picture as string)

            // eventId value
            form.setValue('eventId', props.eventId as string)

            // registrationInput
            form.setValue('registrationData.email', props.email as string)
            form.setValue('registrationData.name', props.userName as string)
            form.setValue('registrationData.tickets', { VIP: 1 })

            await giftTicket(data.contextUser, data.eventId, data.registrationData)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
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
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <Button type="submit">
                                {loading === true ? (
                                    'Gift Ticket'
                                ) : (
                                    <Loader2 className="animate-spin" />
                                )}
                            </Button>
                        </form>
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
