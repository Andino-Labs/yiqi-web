'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { updateOrganization } from '@/services/actions/organizationActions'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SingleFileUpload } from '@/components/upload/upload'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { PublicCommunityType } from '@/schemas/communitySchema'
import { useTranslations } from 'next-intl'
import { OrganizationSchema } from '@/schemas/organizationSchema'

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

const formSchema = OrganizationSchema.extend({
  logo: z.string().url().optional()
})

export default function OrganizationSettings({
  userId,
  organization
}: {
  userId: string
  organization: PublicCommunityType
}) {
  const t = useTranslations('Community')
  const [logo, setLogo] = useState<string>(organization.logo || '')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: organization?.name || '',
      description: organization?.description || '',
      logo: organization?.logo || '',
      colour: organization?.colour || '#000000',
      facebook: organization?.facebook || '',
      instagram: organization?.instagram || '',
      tiktok: organization?.tiktok || '',
      linkedin: organization?.linkedin || '',
      website: organization?.website || ''
    }
  })

  useEffect(() => {
    if (organization) {
      form.reset({
        name: organization.name,
        description: organization.description || '',
        logo: organization.logo || '',
        colour: organization.colour || '#000000',
        facebook: organization.facebook || '',
        instagram: organization.instagram || '',
        tiktok: organization.tiktok || '',
        linkedin: organization.linkedin || '',
        website: organization.website || ''
      })
      setLogo(organization.logo || '')
    }
  }, [organization, form])

  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateOrganization(organization.id, values, userId)
      toast({
        description: `${t('settingsOrganizationUpdated')}`,
        variant: 'default'
      })
    } catch (error) {
      console.log(error)
      toast({
        description: `${error}`,
        variant: 'destructive'
      })
    } finally {
      form.reset()
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen  p-4 dark:bg-[rgb(28, 28, 28)]">
      <div className="w-full max-w-4xl shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          {t('settingOrganizationTitle')}
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settingsOrganizationFormName')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Andino" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('settingsPlaceholderDescription')}
                      {...field}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>{t('settingsOrganizationFormLogo')}</FormLabel>
              <FormControl>
                <div className="flex flex-col items-center space-y-2">
                  {logo && (
                    <Image
                      src={logo}
                      width={128}
                      height={128}
                      alt={t('settingsOrganizationAltLogo')}
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  )}
                  <SingleFileUpload
                    onUploadComplete={url => {
                      form.setValue('logo', url)
                      setLogo(url)
                    }}
                  />
                </div>
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="colour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settingsOrganizationFormColor')}</FormLabel>
                  <FormControl>
                    <ColorPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(
              [
                'facebook',
                'instagram',
                'tiktok',
                'linkedin',
                'website'
              ] as const
            ).map(
              (
                fieldName:
                  | 'facebook'
                  | 'instagram'
                  | 'tiktok'
                  | 'linkedin'
                  | 'website'
              ) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{`${t('settingsOrganizationFormUrl')} ${fieldName.charAt(0).toUpperCase()}${fieldName.slice(
                        1
                      )}`}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`https://${fieldName}.com/`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            )}
            <Button className="w-full" type="submit">
              {t('settingsOrganizationFormSaved')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
