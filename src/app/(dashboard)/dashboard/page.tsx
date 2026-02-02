'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Users, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

interface Booking {
  id: string
  guestName: string
  guestEmail: string
  startTime: string
  endTime: string
  status: string
  eventType: {
    name: string
    duration: number
    color: string
  }
}

interface EventType {
  id: string
  name: string
  duration: number
  color: string
  isActive: boolean
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingsRes, eventTypesRes] = await Promise.all([
          fetch('/api/bookings'),
          fetch('/api/event-types'),
        ])
        
        if (bookingsRes.ok) {
          const data = await bookingsRes.json()
          setBookings(data)
        }
        
        if (eventTypesRes.ok) {
          const data = await eventTypesRes.json()
          setEventTypes(data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const upcomingBookings = bookings
    .filter((b) => new Date(b.startTime) > new Date() && b.status !== 'CANCELLED')
    .slice(0, 5)

  const pendingBookings = bookings.filter((b) => b.status === 'PENDING').length
  const totalBookings = bookings.length
  const activeEventTypes = eventTypes.filter((e) => e.isActive).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}! 👋
        </h2>
        <p className="text-gray-600 mt-1">
          Here&apos;s what&apos;s happening with your bookings today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Bookings"
          value={totalBookings}
          icon={<Calendar className="w-5 h-5" />}
        />
        <StatsCard
          title="Pending Approval"
          value={pendingBookings}
          icon={<Clock className="w-5 h-5" />}
        />
        <StatsCard
          title="Event Types"
          value={activeEventTypes}
          icon={<Users className="w-5 h-5" />}
        />
        <StatsCard
          title="This Month"
          value={bookings.filter((b) => {
            const d = new Date(b.startTime)
            const now = new Date()
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
          }).length}
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upcoming Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Bookings</CardTitle>
            <Link href="/dashboard/bookings">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming bookings</p>
                <p className="text-sm text-gray-400">
                  Share your booking link to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-gray-50"
                  >
                    <div
                      className="w-2 h-12 rounded-full"
                      style={{ backgroundColor: booking.eventType.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {booking.guestName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.eventType.name} • {booking.eventType.duration} min
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(booking.startTime), 'MMM d')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(booking.startTime), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Types */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Event Types</CardTitle>
            <Link href="/dashboard/event-types">
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4 mr-1" /> New
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {eventTypes.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No event types yet</p>
                <Link href="/dashboard/event-types">
                  <Button size="sm" className="mt-4">
                    <Plus className="w-4 h-4 mr-1" /> Create Event Type
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {eventTypes.slice(0, 5).map((eventType) => (
                  <div
                    key={eventType.id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: eventType.color }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{eventType.name}</p>
                      <p className="text-sm text-gray-500">{eventType.duration} minutes</p>
                    </div>
                    <Badge variant={eventType.isActive ? 'success' : 'secondary'}>
                      {eventType.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/event-types">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" /> Create Event Type
              </Button>
            </Link>
            <Link href="/dashboard/availability">
              <Button variant="outline">
                <Clock className="w-4 h-4 mr-2" /> Set Availability
              </Button>
            </Link>
            <Link href="/dashboard/links">
              <Button variant="outline">
                <Link2 className="w-4 h-4 mr-2" /> Share Booking Link
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatsCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
