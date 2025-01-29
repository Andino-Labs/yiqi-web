import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'

export default async function Layout({
  params,
  children
}: {
  params: { id: string }
  children: React.ReactNode
}) {
  const user = await getUser()
  if (!user) redirect('/auth')

  return (
    <main className="flex flex-col items-center justify-center dark:bg-[rgb(28, 28, 28)]">
      <OrganizationLayout
        orgId={params.id}
        userProps={{
          picture: user.picture!,
          email: user.email,
          name: user.name,
          id: user.id
        }}
      >
        {children}
      </OrganizationLayout>
    </main>
  )
}
