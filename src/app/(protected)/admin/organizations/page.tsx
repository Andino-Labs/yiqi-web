import { getAllOrganizations } from '@/services/actions/organizationActions'
import Link from 'next/link'
import Image from 'next/image'
import { AddOrgButton } from './AddOrgButton'
import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import AdminLayout from '@/components/chat/adminLayout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { colors } from '@/lib/colors'

export default async function Page() {
  const user = await getUser()
  if (!user) {
    redirect('/auth')
  }

  if (user.role === Roles.ADMIN) {
    const organizations = await getAllOrganizations()
    return (
      <main className="flex flex-col items-center justify-center">
        <AdminLayout
          userProps={{
            picture: user.picture!,
            email: user.email,
            name: user.name
          }}
        >
          <h1 className="text-3xl font-bold mb-6">Mis organizaciones</h1>
          <div className="mb-6">
            <AddOrgButton value={user.id} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {organizations.map(org => (
              <Card
                key={org.id}
                className="overflow-hidden"
                style={{
                  background: `linear-gradient(to bottom, ${
                    colors({ hex: org.colour!, percent: 50 }) || 'white'
                  }, white)`
                }}
              >
                <CardHeader className="p-4">
                  <div className="w-full h-40 relative mb-4">
                    {org.logo ? (
                      <Image
                        src={org.logo}
                        alt={`${org.name} logo`}
                        layout="fill"
                        objectFit="contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-2xl">No Logo</span>
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl font-semibold text-center">
                    {org.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-center">
                    {org.description || 'No description available'}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center p-4">
                  <Button asChild>
                    <Link href={`/admin/organizations/${org.id}`}>
                      Ir a la organización
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </AdminLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect('/new-user')
  } else if (user.role === Roles.USER) {
    redirect('/user')
  } else if (user.role === Roles.ANDINO_ADMIN) {
    redirect('/andino-admin')
  }
}
