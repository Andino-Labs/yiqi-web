'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { OrganizationSchema } from '@/schemas/organizationSchema'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from '@/components/ui/textarea'

import { createOrganization } from '@/services/actions/organizationActions'
import { useTranslations } from 'next-intl'

function ColorPicker({
  value,
  onChange
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-10 h-10 rounded-md cursor-pointer"
      />
      <Input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="#000000"
        className="w-24"
      />
    </div>
  )
}

const formSchema = OrganizationSchema

function AddOrgButtonForm({ userId }: { userId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      logo: '',
      colour: '#000000' // Default color
    }
  })

  const { toast } = useToast()
  const t = useTranslations('AddOrg')

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createOrganization(values, userId)
      toast({
        description: `${t('success')}`,
        variant: 'default'
      })
    } catch (error) {
      toast({
        description: `${error}`,
        variant: 'destructive'
      })
    } finally {
      await form.reset()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Organization')}</FormLabel>
              <FormControl>
                <Input placeholder="Andino" {...field} />
              </FormControl>
              <FormDescription>{t('organizationBody')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Description')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe tu organización"
                  {...field}
                  className="resize-none"
                />
              </FormControl>
              <FormDescription>{t('descriptionBody')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('LogoURL')}</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} />
              </FormControl>
              <FormDescription>{t('logoDescription')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="colour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Color')}</FormLabel>
              <FormControl>
                <ColorPicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>{t('colorDescription')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          {t('Begin')}
        </Button>
      </form>
    </Form>
  )
}

function AddOrgButton({ userId }: { userId: string }) {
  const t = useTranslations('AddOrg')
  return (
    <Dialog>
      <DialogTrigger asChild className="w-fit">
        <Button className="min-w-fit">{t('createNewOrg')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('createNewOrg')}</DialogTitle>
          <DialogDescription>{t('form')}</DialogDescription>
        </DialogHeader>
        <AddOrgButtonForm userId={userId} />
      </DialogContent>
    </Dialog>
  )
}

export { AddOrgButton }
