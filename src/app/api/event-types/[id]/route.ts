import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const eventType = await prisma.eventType.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            timezone: true,
          },
        },
      },
    })

    if (!eventType) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(eventType)
  } catch (error) {
    console.error('Error fetching event type:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
