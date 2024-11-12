'use client'

import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Trash2 } from 'lucide-react'
import { EventTicketInputSchema } from '@/schemas/eventSchema'

const MAX_TICKETS = 5

const TicketSchema = z.object({
  tickets: z
    .array(EventTicketInputSchema)
    .max(MAX_TICKETS, `You can only create up to ${MAX_TICKETS} ticket types`)
})

type TicketType = z.infer<typeof TicketSchema>['tickets'][number]

interface TicketTypesManagerProps {
  tickets?: TicketType[]
  onUpdate: (tickets: TicketType[]) => void
}

export function TicketTypesManager({
  tickets = [],
  onUpdate
}: TicketTypesManagerProps) {
  const form = useForm<z.infer<typeof TicketSchema>>({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      tickets: tickets.length
        ? tickets
        : [
            {
              name: '',
              category: 'GENERAL',
              description: '',
              price: 0,
              limit: 100,
              ticketsPerPurchase: 1
            }
          ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tickets'
  })

  function onSubmit(data: z.infer<typeof TicketSchema>) {
    onUpdate(data.tickets)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg relative">
              <Badge className="absolute right-2 top-2">
                {form.watch(`tickets.${index}.category`)}
              </Badge>

              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-10"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`tickets.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`tickets.${index}.category`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GENERAL">General</SelectItem>
                          <SelectItem value="VIP">VIP</SelectItem>
                          <SelectItem value="BACKSTAGE">Backstage</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`tickets.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`tickets.${index}.limit`}
                  defaultValue={100}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          value={field.value || '100'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`tickets.${index}.ticketsPerPurchase`}
                  defaultValue={1}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tickets Per Purchase</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          value={field.value || '1'}
                        />
                      </FormControl>
                      <FormDescription>
                        How many tickets can be bought at once
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`tickets.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        {fields.length < MAX_TICKETS && (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                name: '',
                category: 'GENERAL',
                description: '',
                price: 0,
                limit: 100,
                ticketsPerPurchase: 1
              })
            }
          >
            Add Ticket Type
          </Button>
        )}

        <Button type="submit">Save Ticket Types</Button>
      </form>
    </Form>
  )
}
