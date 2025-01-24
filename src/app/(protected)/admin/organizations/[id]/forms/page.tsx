import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import FormCardMenu from '@/components/yiqiForm/FormCardMenu'
import { getUser } from '@/lib/auth/lucia'
import { getOrganization } from '@/services/actions/organizationActions'
import { getForms } from '@/services/actions/typeForm/typeFormActions'
import { FileText, Plus, Users } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
export default async function FormsPage({
  params
}: {
  params: { id: string }
}) {
  const user = await getUser()
  if (!user) {
    redirect('/auth')
  }

  const organization = await getOrganization(params.id)
  if (!organization) {
    return <div>Organization not found</div>
  }
  const formsResponse = await getForms(organization.id)
  if (!formsResponse.success) {
    return (
      <div className="text-center text-gray-700 dark:text-gray-300">
        {formsResponse.error?.message ?? 'Formularios no encontrados'}
      </div>
    )
  }

  const truncateTitle = (title: string, maxLength: number = 20) => {
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title
  }
  return (
    <main className="flex flex-col items-center justify-center">
      <OrganizationLayout
        orgId={params.id}
        userProps={{
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture ?? ''
        }}
      >
        <section className="w-full p-4 md:p-6">
          {formsResponse.forms?.length === 0 ? (
            <Card className="mt-8 bg-transparent border-none">
              <CardContent className="flex flex-col items-center justify-center text-center p-12 space-y-6">
                <p className="text-gray-400 max-w-sm">
                  No hay formularios creados. ¡Comienza creando uno nuevo!
                </p>

                <Link
                  href={`/admin/organizations/${organization.id}/forms/create`}
                  className="group relative inline-flex items-center"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 border-primary/50 text-primary hover:border-primary/80 hover:text-white hover:shadow-lg"
                  >
                    <Plus className="h-6 w-6" />
                    Crear Formulario
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/admin/organizations/${organization.id}/forms/create`}
                className="w-[150px]"
              >
                <Card className="group h-32 hover:border-blue-500  transition-all duration-300 bg-black border-slate-200 dark:border-[#333] overflow-hidden">
                  <CardContent className="h-full flex flex-col items-center justify-center p-4">
                    <div className="p-3 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors">
                      <Plus className="w-6 h-6 text-blue-400" />
                    </div>
                    <p className="mt-2 text-xs font-medium text-gray-200">
                      Nuevo Formulario
                    </p>
                  </CardContent>
                </Card>
              </Link>
              {formsResponse.forms?.map(form => (
                <div key={form.id} className="w-[150px] relative">
                  <FormCardMenu formId={form.id} />

                  <Link
                    href={`/admin/organizations/${organization.id}/forms/${form.id}`}
                  >
                    <Card className="group h-32 hover:border-blue-500 transition-all duration-300 bg-black border-slate-200 dark:border-[#333] overflow-hidden">
                      <CardHeader className="p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-500 stroke-2" />
                          <h3 className="text-sm font-medium text-gray-200 truncate">
                            {form.name}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-400 truncate">
                          {form.description
                            ? truncateTitle(form.description, 30)
                            : 'Sin descripción'}
                        </p>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4 stroke-2" />
                          <span className="text-xs">
                            {form.totalSubmissions} respuestas
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
      </OrganizationLayout>
    </main>
  )
}
