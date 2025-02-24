import { useTranslations } from 'next-intl'

interface Analytics {
  comments: number
  likes: number
  shares: number
  impressions: number
}

export function Analytics({ analytics }: { analytics: Analytics | null }) {
  const t = useTranslations('ManagementTool')

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-full">
        <h2 className="text-xl font-semibold text-center">
          {t('noDataAvailable')}
        </h2>
      </div>
    )
  }

  const stats = [
    { label: t('comments'), value: analytics.comments || 0 },
    { label: t('likes'), value: analytics.likes || 0 },
    { label: t('shares'), value: analytics.shares || 0 },
    { label: t('impressions'), value: analytics.impressions || 0 }
  ]

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-6">{t('analytics')}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800 hover:bg-gray-700 text-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center"
          >
            <span className="text-3xl font-bold">{stat.value}</span>
            <span className="text-gray-400">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
