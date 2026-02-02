import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const eventTypes = await prisma.eventType.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(eventTypes)
  } catch (error) {
    console.error('Error fetching event types:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    
    const eventType = await prisma.eventType.create({
      data: {
        userId: session.user.id,
        name: data.name,
        description: data.description,
        duration: data.duration || 30,
        color: data.color || '#6366f1',
        location: data.location,
        beforeBuffer: data.beforeBuffer || 0,
        afterBuffer: data.afterBuffer || 0,
        requiresApproval: data.requiresApproval || false,
      },
    })

    return NextResponse.json(eventType)
  } catch (error) {
    console.error('Error creating event type:', error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
