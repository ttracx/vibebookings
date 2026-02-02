'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, Clock, Globe, User, Mail, MessageSquare, ChevronLeft, ChevronRight, Loader2, Check } from 'lucide-react'
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore } from 'date-fns'
import { formatTime, TIMEZONES } from '@/lib/utils'

interface EventType {
  id: string
  name: string
  description: string | null
  duration: number
  color: string
  location: string | null
  user: {
    name: string | null
    image: string | null
    timezone: string
  }
}

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const [eventType, setEventType] = useState<EventType | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'calendar' | 'form' | 'confirmed'>('calendar')
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  
  // Form state
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [form, setForm] = useState({
    name: '',
    email: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchEventType() {
      try {
        // First try to fetch as event type ID
        const res = await fetch(`/api/event-types/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setEventType(data)
        } else {
          // Try as username
          const userRes = await fetch(`/api/public/${params.id}`)
          if (userRes.ok) {
            const userData = await userRes.json()
            if (userData.eventTypes?.[0]) {
              setEventType({ ...userData.eventTypes[0], user: userData })
            }
          }
        }
      } catch (error) {
        console.error('Error fetching event type:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEventType()
  }, [params.id])

  useEffect(() => {
    async function fetchSlots() {
      if (!selectedDate || !eventType) return
      
      setLoadingSlots(true)
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd')
        const res = await fetch(
          `/api/public/user/${eventType.id}/slots?date=${dateStr}&timezone=${timezone}`
        )
        if (res.ok) {
          const data = await res.json()
          setAvailableSlots(data.slots || [])
        }
      } catch (error) {
        console.error('Error fetching slots:', error)
        setAvailableSlots([])
      } finally {
        setLoadingSlots(false)
      }
    }
    fetchSlots()
  }, [selectedDate, eventType, timezone])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!eventType || !selectedDate || !selectedTime) return

    setSubmitting(true)
    try {
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const startTime = new Date(selectedDate)
      startTime.setHours(hours, minutes, 0, 0)
      
      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + eventType.duration)

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventTypeId: eventType.id,
          guestName: form.name,
          guestEmail: form.email,
          guestNotes: form.notes,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          timezone,
        }),
      })

      if (res.ok) {
        setStep('confirmed')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
    } finally {
      setSubmitting(false)
    }
  }

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPadding = monthStart.getDay()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!eventType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Event not found</h2>
            <p className="text-gray-600">This booking link may be invalid or expired.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'confirmed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your meeting has been scheduled. A confirmation email has been sent to {form.email}.
            </p>
            <div className="p-4 rounded-lg bg-gray-50 text-left mb-6">
              <p className="font-medium text-gray-900">{eventType.name}</p>
              <p className="text-sm text-gray-600">with {eventType.user?.name}</p>
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {selectedTime && formatTime(selectedTime)} ({eventType.duration} min)
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {TIMEZONES.find(tz => tz.value === timezone)?.label || timezone}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Book Another Time
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">VibeBookings</span>
          </div>
        </div>

        <Card>
          <div className="grid md:grid-cols-5">
            {/* Event Info */}
            <div className="md:col-span-2 p-6 bg-gray-50 border-r border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-indigo-600">
                    {eventType.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{eventType.user?.name}</p>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">{eventType.name}</h1>
              {eventType.description && (
                <p className="text-gray-600 mb-4">{eventType.description}</p>
              )}

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  {eventType.duration} minutes
                </p>
                {eventType.location && (
                  <p className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-4 h-4" />
                    {eventType.location.replace('_', ' ')}
                  </p>
                )}
              </div>

              {/* Timezone selector */}
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-700">Timezone</label>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calendar / Form */}
            <div className="md:col-span-3 p-6">
              {step === 'calendar' ? (
                <div className="space-y-6">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">
                      {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: startPadding }).map((_, i) => (
                      <div key={`pad-${i}`} />
                    ))}
                    {calendarDays.map((day) => {
                      const isPast = isBefore(day, new Date()) && !isToday(day)
                      const isSelected = selectedDate && isSameDay(day, selectedDate)
                      
                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => !isPast && setSelectedDate(day)}
                          disabled={isPast}
                          className={`
                            aspect-square flex items-center justify-center rounded-lg text-sm transition-colors
                            ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-indigo-50'}
                            ${isToday(day) ? 'font-bold' : ''}
                            ${isSelected ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}
                          `}
                        >
                          {format(day, 'd')}
                        </button>
                      )
                    })}
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">
                        {format(selectedDate, 'EEEE, MMMM d')}
                      </h3>
                      {loadingSlots ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">
                          No available times on this day.
                        </p>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => {
                                setSelectedTime(slot)
                                setStep('form')
                              }}
                              className={`
                                py-2 px-3 rounded-lg border text-sm font-medium transition-colors
                                ${selectedTime === slot
                                  ? 'border-indigo-600 bg-indigo-600 text-white'
                                  : 'border-gray-200 hover:border-indigo-300 text-gray-700'
                                }
                              `}
                            >
                              {formatTime(slot)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setStep('calendar')}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>

                  <div className="p-4 rounded-lg bg-gray-50 mb-6">
                    <p className="font-medium text-gray-900">{eventType.name}</p>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {selectedTime && formatTime(selectedTime)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <textarea
                      id="notes"
                      className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                      placeholder="Any additional information..."
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      'Schedule Meeting'
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
