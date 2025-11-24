'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import apiClient from '@/lib/api-client'
import { MetricCard } from '@/components/metric-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, Users, CheckCircle, TrendingUp, Briefcase, Eye, Search, Filter } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [positionFilter, setPositionFilter] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard')
      return response.data
    },
  })

  const { data: positions = [] } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const response = await apiClient.get('/positions')
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">{t('loading')}</p>
      </div>
    )
  }

  const { metrics, upcomingInterviews, recentInterviews } = data || {}

  // Filter recent interviews based on search and filters
  const filteredRecentInterviews = recentInterviews?.filter((interview) => {
    const matchesSearch =
      searchQuery === '' ||
      interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus =
      statusFilter === 'all' || interview.status === statusFilter
    
    const matchesPosition =
      positionFilter === 'all' || interview.position === positionFilter

    return matchesSearch && matchesStatus && matchesPosition
  }) || []

  const handleInterviewClick = (interviewId) => {
    router.push(`/interviews/${interviewId}`)
  }

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      awaitingResponse: 'outline',
    }
    return (
      <Badge variant={variants[status] || 'default'}>
        {t(status)}
      </Badge>
    )
  }

  const getTypeBadge = (type) => {
    const colors = {
      video: 'bg-blue-100 text-blue-800',
      assessment: 'bg-green-100 text-green-800',
      combo: 'bg-purple-100 text-purple-800',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type]}`}>
        {t(type)}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
        <p className="text-muted-foreground">{t('overview')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title={t('totalInterviews')}
          value={metrics?.totalInterviews || 0}
          icon={Calendar}
        />
        <MetricCard
          title={t('thisWeekInterviews')}
          value={metrics?.thisWeekInterviews || 0}
          icon={TrendingUp}
        />
        <MetricCard
          title={t('pendingCandidates')}
          value={metrics?.pendingCandidates || 0}
          icon={Users}
        />
        <MetricCard
          title={t('completedInterviews')}
          value={metrics?.completedInterviews || 0}
          icon={CheckCircle}
        />
        <MetricCard
          title={t('averageScore')}
          value={`${metrics?.averageScore || 0}%`}
          icon={TrendingUp}
        />
        <MetricCard
          title={t('mostActivePosition')}
          value={metrics?.mostActivePosition || '-'}
          icon={Briefcase}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('upcomingInterviews')}</CardTitle>
            <CardDescription>Critical interviews scheduled soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingInterviews?.length > 0 ? (
                upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{interview.candidateName}</p>
                      <p className="text-sm text-muted-foreground">
                        {interview.position}
                      </p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(interview.date), 'PPp')}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getTypeBadge(interview.type)}
                      <Link href={`/interviews/${interview.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          {t('view')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming interviews</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('recentInterviews')}</CardTitle>
            <CardDescription>Latest interview activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInterviews?.length > 0 ? (
                recentInterviews.slice(0, 5).map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{interview.candidateName}</p>
                      <p className="text-sm text-muted-foreground">
                        {interview.position}
                      </p>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(interview.status)}
                        {interview.score && (
                          <span className="text-sm font-semibold text-primary">
                            {interview.score}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(interview.date), 'MMM dd')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent interviews</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
