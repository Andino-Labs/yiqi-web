'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Import, Calendar, Bell, Banknote } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

type Props = {
  importedContacts: boolean
  paymentsIsSetup: boolean
  eventCreated: boolean
  notificationsSent: boolean
  orgId: string
}

export default function WelcomeScreen({
  importedContacts,
  eventCreated,
  notificationsSent,
  orgId,
  paymentsIsSetup
}: Props) {
  const t = useTranslations('WelcomeNewOrg')

  const [tasks] = useState([
    {
      id: 1,
      title: `${t('welcomeScreenTasksImportContacts')}`,
      description: `${t('welcomeScreenTasksImportDescription')}`,
      icon: Import,
      completed: importedContacts,
      link: `/admin/organizations/${orgId}/contacts`
    },
    {
      id: 2,
      title: `${t('welcomeScreenTasksSetupPayments')}`,
      description: `${t('welcomeScreenTasksPaymentDescription')}`,
      icon: Banknote,
      completed: paymentsIsSetup,
      link: `/admin/organizations/${orgId}/billing`
    },
    {
      id: 3,
      title: `${t('welcomeScreenTasksCreateEvents')}`,
      description: `${t('welcomeScreenTasksEventDescription')}`,
      icon: Calendar,
      completed: eventCreated,
      link: `/admin/organizations/${orgId}/events`
    },
    {
      id: 4,
      title: `${t('welcomeScreenTasksSendNotifications')}`,
      description: `${t('welcomeScreenTasksNotificationDescription')}`,
      icon: Bell,
      completed: notificationsSent,
      link: `/admin/organizations/${orgId}/chat`
    }
  ])

  const completedTasks = tasks.filter(task => task.completed).length
  const progress = (completedTasks / tasks.length) * 100

  return (
    <div className={`container mx-auto bg-primary`}>
      <div className={`bg-gradient-to-br bg-primary rounded`}>
        <Card className={`w-full max-w-4xl mx-auto bg-primary`}>
          <CardHeader>
            <CardTitle
              className={`text-3xl font-bold text-center dark:text-white text-purple-800'`}
            >
              {t('welcomeScreenTitle')}
            </CardTitle>
            <CardDescription className="text-center text-lg mt-2">
              {t('welcomeScreenDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress bar section */}
            <div className="mb-6">
              <p className={`text-sm font-medium text-secondary mb-2`}>
                {t('welcomeScreenProgressTitle')}
              </p>
              <Progress value={progress} className="w-full h-2" />
              <p className={`text-right text-sm text-secondary mt-1`}>
                {completedTasks} {t('welcomeOf')} {tasks.length}{' '}
                {t('welcomeScreenTasks')}
              </p>
            </div>
            {/* Task Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {tasks.map(task => (
                <Link href={task.link} key={task.id}>
                  <Card
                    className={`transition-all duration-300 ease-in-out bg-secondary dark:bg-gray-800 text-white`}
                  >
                    <CardContent className="p-4 sm:p-4 md:p-6 lg:p-8 flex items-start space-x">
                      <div
                        className={`p-2 rounded-full mr-2 ${task.completed ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'} dark:bg-white text-black`}
                      >
                        <task.icon className={`w-6 h-6 dark:text-black`} />
                      </div>
                      <div className="flex-grow">
                        <h3
                          className={`font-semibold text-lg mb-1 text-primary`}
                        >
                          {task.title}
                        </h3>
                        <p className={`text-secondary`}>{task.description}</p>
                      </div>
                      <Checkbox
                        checked={task.completed}
                        className={`mt-1 ${task.completed ? 'bg-green-500' : 'bg-gray-300'} dark:border-white dark:text-white`}
                        disabled={true}
                      />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
