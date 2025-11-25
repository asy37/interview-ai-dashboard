import { NextResponse } from 'next/server'
import { mockTemplates } from '@/lib/mock-data'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const template = mockTemplates.find((t) => t.id === id)

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(template)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()
    const index = mockTemplates.findIndex((t) => t.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    mockTemplates[index] = { ...mockTemplates[index], ...data }

    return NextResponse.json(mockTemplates[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const index = mockTemplates.findIndex((t) => t.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    mockTemplates.splice(index, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
