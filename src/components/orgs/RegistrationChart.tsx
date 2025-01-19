'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getRegistrationStats } from '@/services/actions/org/getRegistrationStats'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import type { RegistrationStats } from '@/schemas/dataSchemas'

interface Props {
  organizationId: string
}

export default function RegistrationChart({ organizationId }: Props) {
  const t = useTranslations('RegistrationChart')
  const [data, setData] = useState<RegistrationStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const stats = await getRegistrationStats(organizationId)
        setData(stats)
      } catch (error) {
        console.error('Error fetching registration stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [organizationId])

  // Format date to show just the day
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.getDate().toString()
  }

  // Format full date for tooltip
  const formatTooltipDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] sm:h-[300px] w-full flex items-center justify-center">
            Loading...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] sm:h-[300px] w-full flex items-center justify-center">
            {t('noData')}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                interval={0}
                tick={{ fontSize: 14 }}
              />
              <YAxis allowDecimals={false} width={30} tick={{ fontSize: 14 }} />
              <Tooltip
                labelFormatter={value => formatTooltipDate(value as string)}
                contentStyle={{
                  fontSize: '14px',
                  padding: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
