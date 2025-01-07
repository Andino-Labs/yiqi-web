'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
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
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'
import {
  updateBillingInfo,
  type BillingInfo
} from '@/services/actions/billing/updateBillingInfo'

const bankAccountSchema = z.object({
  accountName: z.string().min(2, 'Account name must be at least 2 characters'),
  accountNumber: z.string().min(10, 'Please enter a valid CCI number'),
  country: z.string().min(2, 'Please select a country')
})

type BankAccountFormProps = {
  organizationId: string
  initialData?: BillingInfo
}

export function BankAccountForm({
  organizationId,
  initialData
}: BankAccountFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof bankAccountSchema>>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: initialData || {
      accountName: '',
      accountNumber: '',
      country: ''
    }
  })

  async function onSubmit(values: z.infer<typeof bankAccountSchema>) {
    try {
      setLoading(true)
      const result = await updateBillingInfo(organizationId, values)

      if (result.success) {
        toast({
          title: 'Billing information updated',
          description: 'Your bank account details have been saved.'
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error updating billing info:', error)
      toast({
        title: 'Error',
        description: 'Failed to update billing information. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the name on your bank account"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CCI Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your CCI number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PE">Peru</SelectItem>
                  <SelectItem value="CL">Chile</SelectItem>
                  <SelectItem value="CO">Colombia</SelectItem>
                  {/* Add more countries as needed */}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Bank Account Details'}
        </Button>
      </form>
    </Form>
  )
}
