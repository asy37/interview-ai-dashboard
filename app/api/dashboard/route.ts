import { NextResponse } from 'next/server'
import { mockInterviews, mockPositions } from '@/lib/mock-data'

export async function GET() {
  try {
    const totalInterviews = mockInterviews.length
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)

    const thisWeekInterviews = mockInterviews.filter(
      (i) => i.date >= startOfWeek && i.date <= endOfWeek
    ).length

    const pendingCandidates = mockInterviews.filter(
      (i) => i.status === 'pending' || i.status === 'awaitingResponse'
    ).length

    const completedInterviews = mockInterviews.filter(
      (i) => i.status === 'completed'
    ).length

    const completedScores = mockInterviews
      .filter((i) => i.status === 'completed' && i.score)
      .map((i) => i.score)
    const averageScore =
      completedScores.length > 0
        ? Math.round(
            completedScores.reduce((a, b) => a + b, 0) / completedScores.length
          )
        : 0

    const positionCounts = {}
    mockInterviews.forEach((i) => {
      positionCounts[i.position] = (positionCounts[i.position] || 0) + 1
    })
    const mostActivePosition = Object.keys(positionCounts).reduce((a, b) =>
      positionCounts[a] > positionCounts[b] ? a : b
    )

    const upcomingInterviews = mockInterviews
      .filter((i) => i.date > now && i.status !== 'completed')
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3)

    const recentInterviews = [...mockInterviews]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5)

    return NextResponse.json({
      metrics: {
        totalInterviews,
        thisWeekInterviews,
        pendingCandidates,
        completedInterviews,
        averageScore,
        mostActivePosition,
      },
      upcomingInterviews,
      recentInterviews,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
