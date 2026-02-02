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

    const availability = await prisma.availability.findMany({
      where: { userId: session.user.id },
      orderBy: { dayOfWeek: 'asc' },
    })

    return NextResponse.json(availability)
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    
    // Upsert availability for each day
    const results = await Promise.all(
      data.map(async (day: any) => {
        return prisma.availability.upsert({
          where: {
            userId_dayOfWeek: {
              userId: session.user.id,
              dayOfWeek: day.dayOfWeek,
            },
          },
          update: {
            startTime: day.startTime,
            endTime: day.endTime,
            isEnabled: day.isEnabled,
          },
          create: {
            userId: session.user.id,
            dayOfWeek: day.dayOfWeek,
            startTime: day.startTime,
            endTime: day.endTime,
            isEnabled: day.isEnabled,
          },
        })
      })
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error updating availability:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
