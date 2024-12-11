import { getOrganization } from '@/services/actions/organizationActions'
import { getOrganizationContacts } from '@/services/actions/contactActions'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { getUser } from '@/lib/auth/lucia'
import Link from 'next/link'
import { ImportContactTemplateButton } from './ImportContactTemplateButton'
import { ImportContactButton } from './ImportContactButton'
import { getTranslations } from 'next-intl/server'

export default async function ContactsPage({
  params
}: {
  params: { id: string }
}) {
  const user = await getUser()
  const t = await getTranslations('contactFor')

  const organization = await getOrganization(params.id)
  const contacts = await getOrganizationContacts(params.id)

  if (!organization || !user) {
    return <div>{t('noOrganizationFound')}</div>
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <OrganizationLayout
        orgId={params.id}
        userProps={{
          id: user.id,
          picture: user.picture!,
          email: user.email,
          name: user.name
        }}
      >
        <section className="w-full h-screen sm:p-4 rounded-lg sm:border text-card-foreground shadow-sm bg-primary">
          <div className="flex w-full justify-between gap-2">
            <h1 className="text-xl sm:text-2xl font-bold">
              <span>{t('contactsFor')}</span> {organization.name}
            </h1>
            <ImportContactButton organizationId={organization.id} />
          </div>
          <div className="mb-2 mt-2">
            <ImportContactTemplateButton />
          </div>

          <div className="flex flex-row justify-between bg-gray-700 p-4 rounded mt-4">
            <div className="col-span-6 text-sm font-semibold text-primary">
              {t('contact')}
            </div>
            <div className="col-span-3 text-sm font-semibold text-primary"></div>
            <div className="col-span-3 text-sm font-semibold text-primary text-right">
              {t('email')}
            </div>
          </div>

          <div className="overflow-y-auto dark:bg-primary rounded-lg">
            {contacts.map(user => (
              <Link
                key={user.id}
                href={`/admin/organizations/${params.id}/contacts/${user?.id}`}
                className="block"
              >
                <div
                  className="flex flex-row justify-between items-center text-sm border-b border-gray-700 
                  p-4 transition-all dark:hover:bg-sidebar-accent/60 cursor-pointer"
                >
                  <div className="flex flex-row items-center">{user.name}</div>
                  <div className="flex flex-row items-center">
                    {user?.email}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </OrganizationLayout>
    </main>
  )
}
