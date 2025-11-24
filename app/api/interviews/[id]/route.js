import { NextResponse } from 'next/server'
import { mockInterviews } from '@/lib/mock-data'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const interview = mockInterviews.find((i) => i.id === id)

    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(interview)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch interview' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()
    const index = mockInterviews.findIndex((i) => i.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      )
    }

    mockInterviews[index] = { ...mockInterviews[index], ...data }

    return NextResponse.json(mockInterviews[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update interview' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const index = mockInterviews.findIndex((i) => i.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      )
    }

    mockInterviews.splice(index, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete interview' },
      { status: 500 }
    )
  }
}
