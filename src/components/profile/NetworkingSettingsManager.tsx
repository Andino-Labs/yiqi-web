'use client'
import { useState } from 'react'
import { Props } from './common'
import NetworkingProfileForm from './NetworkingProfileForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card'
import { Button } from '../ui/button'
import { Edit } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function NetworkingSettingsManager({
  initialData,
  user
}: Props) {
  const [showEditForm, setShowEditForm] = useState(false)
  const t = useTranslations('Networking')

  if (!user.userDetailedProfile || showEditForm) {
    return (
      <NetworkingProfileForm
        initialData={initialData}
        user={user}
        onComplete={() => setShowEditForm(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('yourNetworkingProfile')}</CardTitle>
            <CardDescription>
              {t('aiGeneratedProfileDescription')}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowEditForm(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            {t('editProfile')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">{t('detailedProfile')}</h3>
              <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                {user.userDetailedProfile}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">{t('contentPreferences')}</h3>
              <div className="mt-2 text-sm text-muted-foreground">
                {user.userContentPreferences}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
