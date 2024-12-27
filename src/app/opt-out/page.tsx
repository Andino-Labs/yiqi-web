import { verifyOptOutToken } from '@/lib/auth/optOut'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { updateUserCommunicationPreference } from '@/services/actions/user/updateCommunicationPreference'
import prisma from '@/lib/prisma'

export default async function OptOutPage({
  searchParams
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token
  if (!token) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Invalid or missing token. Please use the link provided in the email.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const { valid, userId } = await verifyOptOutToken(token)
  if (!valid || !userId) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Invalid or expired token. Please request a new opt-out link.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stopCommunication: true }
  })

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>User not found.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Communication Preferences</CardTitle>
          <CardDescription>
            Manage your email communication preferences for Yiqi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateUserCommunicationPreference}>
            <input type="hidden" name="userId" value={userId} />
            <div className="flex items-center space-x-2">
              <Switch
                name="stopCommunication"
                defaultChecked={!user.stopCommunication}
              />
              <Label htmlFor="stopCommunication">
                Receive communications from Andino
              </Label>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
