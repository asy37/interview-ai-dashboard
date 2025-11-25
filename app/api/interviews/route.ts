import { NextResponse } from 'next/server'
import { mockInterviews } from '@/lib/mock-data'
import type { InterviewType, MockInterview, InterviewStatus } from '@/lib/mock-data'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const position = searchParams.get('position')
    const status = searchParams.get('status')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    let filteredInterviews = [...mockInterviews]

    if (search) {
      filteredInterviews = filteredInterviews.filter(
        (i) =>
          i.candidateName.toLowerCase().includes(search.toLowerCase()) ||
          i.position.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (position) {
      filteredInterviews = filteredInterviews.filter(
        (i) => i.position === position
      )
    }

    if (status) {
      filteredInterviews = filteredInterviews.filter((i) => i.status === status)
    }

    if (dateFrom) {
      filteredInterviews = filteredInterviews.filter(
        (i) => i.date >= new Date(dateFrom)
      )
    }

    if (dateTo) {
      filteredInterviews = filteredInterviews.filter(
        (i) => i.date <= new Date(dateTo)
      )
    }

    return NextResponse.json(filteredInterviews)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const type = (data.type ?? 'assessment') as InterviewType
    const status: InterviewStatus = 'pending'

    const newInterview: MockInterview = {
      id: uuidv4(),
      candidateId: uuidv4(),
      candidateName: data.candidateName,
      position: data.position,
      date: new Date(data.date),
      type,
      status,
      score: null,
      notes: data.notes || '',
      templateId: data.templateId || null,
    }

    mockInterviews.push(newInterview)

    return NextResponse.json(newInterview, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create interview' },
      { status: 500 }
    )
  }
}
