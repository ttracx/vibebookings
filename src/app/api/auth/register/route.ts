import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, timezone } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        timezone: timezone || 'America/New_York',
      },
    })

    // Create default availability (Mon-Fri 9-5)
    const defaultAvailability = [1, 2, 3, 4, 5].map((day) => ({
      userId: user.id,
      dayOfWeek: day,
      startTime: '09:00',
      endTime: '17:00',
      isEnabled: true,
    }))

    await prisma.availability.createMany({
      data: defaultAvailability,
    })

    // Create default event type
    await prisma.eventType.create({
      data: {
        userId: user.id,
        name: '30 Minute Meeting',
        description: 'A quick 30 minute call',
        duration: 30,
        color: '#6366f1',
      },
    })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
