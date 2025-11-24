import { NextResponse } from 'next/server'
import { mockTemplates } from '@/lib/mock-data'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    return NextResponse.json(mockTemplates)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    const newTemplate = {
      id: uuidv4(),
      name: data.name,
      questionCount: data.questions.length,
      createdDate: new Date(),
      createdBy: 'Current User',
      usageCount: 0,
      isFavorite: false,
      questions: data.questions.map((q) => ({
        ...q,
        id: uuidv4(),
      })),
    }

    mockTemplates.push(newTemplate)

    return NextResponse.json(newTemplate, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
