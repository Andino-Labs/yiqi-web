"use client"

import { SearchUser } from "@/services/giftTicket/searchUser"
import { Input } from "../ui/input"
import { useState } from "react"
import Image from "next/image"
import { EllipsisVertical } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

export interface SearchResults {
    name: string | undefined,
    email: string | undefined,
    picture: string | undefined | null
}

export default function GiftTicket() {
    const [results, setResults] = useState<SearchResults[]>([])
    const [searchTerm, setSearchTerm] = useState("");

    async function search(value: string) {
        setSearchTerm(value);
        if (value.trim() === "") {
            setResults([]); // Clear results if search input is empty
            return;
        }
        const search = await SearchUser(value);
        setResults(search);
    }
    return (
        <div className="flex flex-col space-y-3">
            {/* title and description */}
            <div className="">
                <h2 className="text-xl font-semibold mb-2">
                    Gift Ticket
                </h2>
                <p className="text-muted-foreground">
                    You can easily give out free tickets to people by
                    simply searching their name or email address
                </p>
            </div>

            {/* form */}
            <div className="flex flex-col space-y-3">
                <div className="flex justify-start flex-col">
                    <label htmlFor="search">Search</label>
                    <Input
                        type="text"
                        placeholder="search username or email"
                        onChange={(e) => search(e.target.value)}
                    />
                </div>

                {searchTerm && results && results.length > 0 && (
                    <div>
                        <h3 className="font-semibold mt-3">Search Results</h3>
                        <ul className="space-y-2 w-full bg-accent/60 p-5 rounded-2xl">
                            {results.map((result, index) => (
                                <li key={index} className="w-full flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {result.picture && (
                                            <div className="w-10 h-10 rounded-full relative">
                                                <Image
                                                    src={result.picture}
                                                    alt={result.name || "User"}
                                                    className="object-cover rounded-full"
                                                    fill
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium">{result.name || "No Name"}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {result.email}
                                            </p>
                                        </div>
                                    </div>
                                    <GiftUser userName={result.name} />
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
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <EllipsisVertical className="stroke-accent-foreground cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] flex flex-col justify-start">
                <DialogHeader>
                    <DialogTitle className="flex space-x-3">
                        {`Gift a ticket to ${props.userName}`}</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="sm:justify-start">
                    <form>

                    </form>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}