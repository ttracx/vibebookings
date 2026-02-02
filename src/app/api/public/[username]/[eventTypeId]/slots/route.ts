import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateTimeSlots } from '@/lib/utils'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string; eventTypeId: string }> }
) {
  try {
    const { eventTypeId } = await params
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    const timezone = searchParams.get('timezone') || 'America/New_York'

    if (!date) {
      return NextResponse.json({ error: 'Date required' }, { status: 400 })
    }

    const eventType = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
      include: {
        user: {
          include: {
            availability: true,
          },
        },
      },
    })

    if (!eventType) {
      return NextResponse.json({ error: 'Event type not found' }, { status: 404 })
    }

    // Get day of week for the requested date
    const requestedDate = new Date(date)
    const dayOfWeek = requestedDate.getDay()

    // Find availability for this day
    const dayAvailability = eventType.user.availability.find(
      (a) => a.dayOfWeek === dayOfWeek && a.isEnabled
    )

    if (!dayAvailability) {
      return NextResponse.json({ slots: [] })
    }

    // Generate time slots
    const allSlots = generateTimeSlots(
      dayAvailability.startTime,
      dayAvailability.endTime,
      eventType.duration,
      eventType.beforeBuffer + eventType.afterBuffer
    )

    // Get existing bookings for this date
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const existingBookings = await prisma.booking.findMany({
      where: {
        hostId: eventType.userId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        startTime: { gte: startOfDay, lte: endOfDay },
      },
    })

    // Filter out booked slots
    const bookedTimes = existingBookings.map((b) => {
      const time = new Date(b.startTime)
      return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`
    })

    const availableSlots = allSlots.filter((slot) => !bookedTimes.includes(slot))

    // Filter past times if date is today
    const now = new Date()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (requestedDate.getTime() === today.getTime()) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      return NextResponse.json({
        slots: availableSlots.filter((slot) => {
          const [hours, mins] = slot.split(':').map(Number)
          return hours * 60 + mins > currentMinutes + 30 // 30 min buffer
        }),
      })
    }

    return NextResponse.json({ slots: availableSlots })
  } catch (error) {
    console.error('Error fetching slots:', error)
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 })
  }
}
