'use client'

import { Button } from '../ui/button'
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
import { createOrganization } from '@/services/actions/organizationActions'
import { OrganizationSchema } from '@/services/organizationService'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from '../ui/textarea'
import { makeRegularUser } from '@/services/actions/userActions'
import { SingleFileUpload } from '../upload/upload'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

function BeRegularUserButton({ userId }: { userId: { value: string } }) {
  const { toast } = useToast()
  const t = useTranslations('newUser')
  const router = useRouter()
  return (
    <Button
      className="min-w-full"
      onClick={async () => {
        await makeRegularUser({ userId: userId.value })
        toast({
          description: `${t('welcome')}`,
          variant: 'default'
        })
        router.push('/events')
      }}
    >
      {t('attended')}
    </Button>
  )
}

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

export default function BeEventAdminForm({
  userId
}: {
  userId: { value: string }
}) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      logo: '',
      colour: '#000000',
      facebook: '',
      instagram: '',
      tiktok: '',
      linkedin: '',
      website: ''
    }
  })

  const { toast } = useToast()
  const t = useTranslations('newUser')

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createOrganization(values, userId.value)
      toast({
        description: `${t('success')}`,
        variant: 'default'
      })
      router.push('/admin')
    } catch (error) {
      toast({
        description: `${error}`,
        variant: 'destructive'
      })
    } finally {
      form.reset()
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
                  placeholder={t('describe')}
                  {...field}
                  className="resize-none"
                />
              </FormControl>
              <FormDescription>{t('descriptionBody')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormLabel>{t('Logo')}</FormLabel>
        <FormControl>
          <SingleFileUpload
            onUploadComplete={url => form.setValue('logo', url)}
          />
        </FormControl>
        <FormDescription>{t('logoDescription')}</FormDescription>

        <FormField
          control={form.control}
          name="colour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Color')}</FormLabel>
              <FormControl>
                <ColorPicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>{t('color')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{("faceBook")}</FormLabel>
              <FormControl>
                <Input placeholder="https://www.facebook.com/" {...field} />
              </FormControl>
              <FormDescription>
                {t("feacebookDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("instagram")}</FormLabel>
              <FormControl>
                <Input placeholder="https://www.instagram.com/" {...field} />
              </FormControl>
              <FormDescription>
                {t("instagramDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tiktok"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Tiktok")}</FormLabel>
              <FormControl>
                <Input placeholder="https://www.tiktok.com/" {...field} />
              </FormControl>
              <FormDescription>
                {t("tiktokDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("LinkedIn")}</FormLabel>
              <FormControl>
                <Input placeholder="https://www.linkedin.com/" {...field} />
              </FormControl>
              <FormDescription>
                {t("LinkedInDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Website")}</FormLabel>
              <FormControl>
                <Input placeholder="https://www.andinolabs.com/" {...field} />
              </FormControl>
              <FormDescription>{t("websiteDescription")}</FormDescription>
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
function BeEventAdmin(userId: { value: string }) {
  const t = useTranslations('newUser')
  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <Button className="min-w-full">{t('manage')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('createCommunityManager')}</DialogTitle>
          <DialogDescription>{t('form')}</DialogDescription>
        </DialogHeader>
        <BeEventAdminForm userId={userId} />
      </DialogContent>
    </Dialog>
  )
}

export { BeRegularUserButton, BeEventAdmin }
