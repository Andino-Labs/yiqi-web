import { Button } from '@/components/ui/button'
import { DataTwitterSchema } from '@/schemas/twitterSchema'
import { BarChart, CalendarIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface HeaderProps {
  onNewPost: () => void
  openAnalytics: () => void
  openCalendar: () => void
  data: DataTwitterSchema
}

export function Header({ onNewPost, openAnalytics, openCalendar, data }: HeaderProps) {
  const t = useTranslations('ManagementTool')

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-lg font-semibold">
                {data ? data.accountUsername.slice(0, 9) : ''}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border">
              <Button variant="ghost" size="sm" onClick={openAnalytics} >
                <BarChart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={openCalendar}>
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={onNewPost} className="bg-blue-600 text-white hover:bg-blue-700">
              {t('newPost')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
