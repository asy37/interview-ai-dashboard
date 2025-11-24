import { NextResponse } from 'next/server'
import { mockPositions } from '@/lib/mock-data'

export async function GET() {
  try {
    return NextResponse.json(mockPositions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch positions' },
      { status: 500 }
    )
  }
}
