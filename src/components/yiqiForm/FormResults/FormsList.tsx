'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import FormCardMenu from '@/components/yiqiForm/FormCardMenu'
import ButtonClipboard from '@/components/yiqiForm/FormCreator/ButtonClipboard'
import { FileText, Link2, Plus, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
interface Form {
  id: string
  name: string
  description: string
  totalSubmissions: number
}

interface FormsListProps {
  organizationId: string
  forms: Form[]
}

export default function FormsList({ organizationId, forms }: FormsListProps) {
  const t = useTranslations('yiqiForm')

  return (
    <section className="w-full p-4 md:p-6">
      {forms?.length === 0 ? (
        <Card className="mt-8 bg-transparent border-none">
          <CardContent className="flex flex-col items-center justify-center text-center p-12 space-y-6">
            <p className="text-gray-400 max-w-sm">{t('noFormsCreated')}</p>
            <Link
              href={`/admin/organizations/${organizationId}/forms/create`}
              className="group relative inline-flex items-center"
            >
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-primary/50 text-primary hover:border-primary/80 hover:text-white hover:shadow-lg"
              >
                <Plus className="h-6 w-6" />
                {t('createForm')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-wrap gap-4">
          <Link
            href={`/admin/organizations/${organizationId}/forms/create`}
            className="w-[150px]"
          >
            <Card className="group h-32 hover:border-blue-500  transition-all duration-300 bg-black border-slate-200 dark:border-[#333] overflow-hidden">
              <CardContent className="h-full flex flex-col items-center justify-center p-4">
                <div className="p-3 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors">
                  <Plus className="w-6 h-6 text-blue-400" />
                </div>
                <p className="mt-2 text-xs font-medium text-gray-200">
                  {t('newForm')}
                </p>
              </CardContent>
            </Card>
          </Link>
          {forms?.map(form => (
            <div key={form.id} className="w-[150px] relative">
              <div className="absolute bottom-1 left-1 z-10  flex items-center justify-center">
                <ButtonClipboard
                  className="py-1 text-xs "
                  size="sm"
                  textCopied={t('linkCopied')}
                  textCopy={t('copyLink')}
                  text={`${process.env.NEXT_PUBLIC_URL}/form/${form.id}`}
                  icon={<Link2 className="h-4 w-4 text-blue-500" />}
                />
              </div>
              <FormCardMenu formId={form.id} />
              <Link
                href={`/admin/organizations/${organizationId}/forms/${form.id}`}
              >
                <Card className="group h-32 hover:border-blue-500 transition-all duration-300 bg-black border-slate-200 dark:border-[#333] overflow-hidden">
                  <CardHeader className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500 stroke-2" />
                      <h3 className="text-sm font-medium text-gray-200 truncate">
                        {form.name}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4 stroke-2" />
                      <span className="text-xs">
                        {form.totalSubmissions} {t('responses')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
