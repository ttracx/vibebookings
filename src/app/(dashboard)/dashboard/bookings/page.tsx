'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Mail, User, Check, X, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

interface Booking {
  id: string
  guestName: string
  guestEmail: string
  guestNotes: string | null
  startTime: string
  endTime: string
  timezone: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
  eventType: {
    name: string
    duration: number
    color: string
  }
}

const statusColors = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  CANCELLED: 'destructive',
  COMPLETED: 'secondary',
  NO_SHOW: 'destructive',
} as const

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    try {
      const res = await fetch('/api/bookings')
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateBookingStatus(id: string, status: string) {
    setUpdating(id)
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        await fetchBookings()
      }
    } catch (error) {
      console.error('Error updating booking:', error)
    } finally {
      setUpdating(null)
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const now = new Date()
    const bookingDate = new Date(booking.startTime)
    
    if (filter === 'upcoming') {
      return bookingDate > now && booking.status !== 'CANCELLED'
    } else if (filter === 'past') {
      return bookingDate <= now || booking.status === 'CANCELLED'
    }
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
          <p className="text-gray-600">Manage your upcoming and past appointments.</p>
        </div>
        <div className="flex gap-2">
          {(['upcoming', 'past', 'all'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500">
              {filter === 'upcoming'
                ? "You don't have any upcoming bookings."
                : filter === 'past'
                ? "You don't have any past bookings."
                : "You don't have any bookings yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-1 h-full min-h-[80px] rounded-full"
                    style={{ backgroundColor: booking.eventType.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {booking.eventType.name}
                          </h3>
                          <Badge variant={statusColors[booking.status]}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(booking.startTime), 'EEEE, MMMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(new Date(booking.startTime), 'h:mm a')} -{' '}
                            {format(new Date(booking.endTime), 'h:mm a')}
                          </span>
                        </div>
                      </div>

                      {booking.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                            disabled={updating === booking.id}
                          >
                            {updating === booking.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Confirm
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                            disabled={updating === booking.id}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{booking.guestName}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{booking.guestEmail}</span>
                        </span>
                      </div>
                      {booking.guestNotes && (
                        <p className="mt-2 text-sm text-gray-600">
                          <strong>Notes:</strong> {booking.guestNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
