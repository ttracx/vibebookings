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

    const bookings = await prisma.booking.findMany({
      where: { hostId: session.user.id },
      include: {
        eventType: true,
      },
      orderBy: { startTime: 'asc' },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    const eventType = await prisma.eventType.findUnique({
      where: { id: data.eventTypeId },
      include: { user: true },
    })

    if (!eventType) {
      return NextResponse.json({ error: 'Event type not found' }, { status: 404 })
    }

    // Check for conflicting bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        hostId: eventType.userId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            startTime: { lt: new Date(data.endTime) },
            endTime: { gt: new Date(data.startTime) },
          },
        ],
      },
    })

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'This time slot is no longer available' },
        { status: 409 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        eventTypeId: data.eventTypeId,
        hostId: eventType.userId,
        guestEmail: data.guestEmail,
        guestName: data.guestName,
        guestNotes: data.guestNotes,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        timezone: data.timezone,
        status: eventType.requiresApproval ? 'PENDING' : 'CONFIRMED',
        responses: data.responses,
      },
      include: {
        eventType: true,
        host: {
          select: { name: true, email: true },
        },
      },
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
