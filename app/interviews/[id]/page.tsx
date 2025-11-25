'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import apiClient from '@/lib/api-client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Download,
  FileText,
  Video,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'

export default function InterviewDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useTranslation()
  const interviewId = params.id

  const { data: interview, isLoading } = useQuery({
    queryKey: ['interview', interviewId],
    queryFn: async () => {
      const response = await apiClient.get(`/interviews/${interviewId}`)
      return response.data
    },
    enabled: !!interviewId,
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">{t('loading')}</p>
      </div>
    )
  }

  if (!interview) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p className="mb-4 text-lg">Interview not found</p>
        <Link href="/interviews">
          <Button>Back to Interviews</Button>
        </Link>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      awaitingResponse: 'outline',
    }
    return <Badge variant={variants[status] || 'default'}>{t(status)}</Badge>
  }

  const getTypeBadge = (type) => {
    const colors = {
      video: 'bg-blue-100 text-blue-800',
      assessment: 'bg-green-100 text-green-800',
      combo: 'bg-purple-100 text-purple-800',
    }
    return (
      <span
        className={`rounded-full px-3 py-1 text-sm font-medium ${colors[type]}`}
      >
        {t(type)}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/interviews">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{interview.candidateName}</h1>
            <p className="text-muted-foreground">{interview.position}</p>
          </div>
        </div>
        {interview.status === 'completed' && (
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Interview Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {format(new Date(interview.date), 'PPP')}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(interview.date), 'p')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Type & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {getTypeBadge(interview.type)}
            <div>{getStatusBadge(interview.status)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            {interview.score ? (
              <div className="space-y-2">
                <p className="text-3xl font-bold text-primary">
                  {interview.score}%
                </p>
                <Progress value={interview.score} className="h-2" />
              </div>
            ) : (
              <p className="text-muted-foreground">Not yet scored</p>
            )}
          </CardContent>
        </Card>
      </div>

      {interview.status === 'completed' && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {interview.type === 'video' || interview.type === 'combo' ? (
              <TabsTrigger value="video">Video Analysis</TabsTrigger>
            ) : null}
            {interview.type === 'assessment' || interview.type === 'combo' ? (
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
            ) : null}
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Interview Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 font-medium">Candidate Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{' '}
                      {interview.candidateName}
                    </p>
                    <p>
                      <span className="font-medium">Position:</span>{' '}
                      {interview.position}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{' '}
                      {format(new Date(interview.date), 'PPP')}
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="mb-2 font-medium">Performance Overview</h4>
                  <p className="text-sm text-muted-foreground">
                    {interview.notes}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {(interview.type === 'video' || interview.type === 'combo') &&
            interview.aiScores && (
              <TabsContent value="video" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Interview Analysis</CardTitle>
                    <CardDescription>
                      AI-powered evaluation of video interview
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                      {interview.videoUrl ? (
                        <iframe
                          src={interview.videoUrl}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Video className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">AI Evaluation Scores</h4>
                      {(Object.entries(interview.aiScores) as [string, number][]).map(
                        ([key, value]) => (
                          <div key={key} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium capitalize">
                                {key}
                              </span>
                              <span className="font-semibold">{value}%</span>
                            </div>
                            <Progress value={value} className="h-2" />
                          </div>
                        )
                      )}
                    </div>

                    {interview.transcript && (
                      <div className="space-y-2">
                        <h4 className="flex items-center gap-2 font-semibold">
                          <MessageSquare className="h-4 w-4" />
                          Transcript
                        </h4>
                        <div className="rounded-lg bg-muted p-4">
                          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                            {interview.transcript}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

          {(interview.type === 'assessment' || interview.type === 'combo') &&
            interview.assessmentScores && (
              <TabsContent value="assessment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Results</CardTitle>
                    <CardDescription>
                      Question-by-question breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {interview.assessmentScores.map((item, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium">
                                Q{index + 1}: {item.question}
                              </p>
                            </div>
                            <span className="ml-4 text-lg font-bold text-primary">
                              {item.score}/{item.maxScore}
                            </span>
                          </div>
                          <Progress
                            value={(item.score / item.maxScore) * 100}
                            className="h-2"
                          />
                          {index < interview.assessmentScores.length - 1 && (
                            <Separator className="mt-4" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>HR Notes</CardTitle>
                <CardDescription>
                  Internal notes and observations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="whitespace-pre-wrap text-sm">
                      {interview.hrNotes ||
                        interview.notes ||
                        'No notes available'}
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {interview.status !== 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle>Interview Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {interview.status === 'pending'
                  ? 'This interview is scheduled but not yet conducted.'
                  : 'Waiting for candidate response to interview invitation.'}
              </p>
              {interview.notes && (
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm">{interview.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
