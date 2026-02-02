'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Clock, Loader2, Check } from 'lucide-react'
import { DAYS_OF_WEEK } from '@/lib/utils'

interface AvailabilityDay {
  dayOfWeek: number
  startTime: string
  endTime: string
  isEnabled: boolean
}

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<AvailabilityDay[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchAvailability()
  }, [])

  async function fetchAvailability() {
    try {
      const res = await fetch('/api/availability')
      if (res.ok) {
        const data = await res.json()
        // Ensure all days are present
        const fullWeek = DAYS_OF_WEEK.map((_, index) => {
          const existing = data.find((d: AvailabilityDay) => d.dayOfWeek === index)
          return existing || {
            dayOfWeek: index,
            startTime: '09:00',
            endTime: '17:00',
            isEnabled: false,
          }
        })
        setAvailability(fullWeek)
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(availability),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (error) {
      console.error('Error saving availability:', error)
    } finally {
      setSaving(false)
    }
  }

  function updateDay(dayOfWeek: number, updates: Partial<AvailabilityDay>) {
    setAvailability((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, ...updates } : day
      )
    )
  }

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
          <h2 className="text-2xl font-bold text-gray-900">Availability</h2>
          <p className="text-gray-600">Set your weekly schedule for accepting bookings.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Hours</CardTitle>
          <CardDescription>
            Set the times you&apos;re available for bookings each day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availability.map((day) => (
              <div
                key={day.dayOfWeek}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  day.isEnabled ? 'border-indigo-200 bg-indigo-50/50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="w-32">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={day.isEnabled}
                      onChange={(e) => updateDay(day.dayOfWeek, { isEnabled: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className={`font-medium ${day.isEnabled ? 'text-gray-900' : 'text-gray-400'}`}>
                      {DAYS_OF_WEEK[day.dayOfWeek]}
                    </span>
                  </label>
                </div>

                {day.isEnabled ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={day.startTime}
                        onChange={(e) => updateDay(day.dayOfWeek, { startTime: e.target.value })}
                        className="w-32"
                      />
                    </div>
                    <span className="text-gray-400">to</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={day.endTime}
                        onChange={(e) => updateDay(day.dayOfWeek, { endTime: e.target.value })}
                        className="w-32"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Unavailable</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-indigo-500 mt-0.5" />
              Your availability is shown to bookers in their local timezone.
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-indigo-500 mt-0.5" />
              Set buffer times in your event types to prevent back-to-back meetings.
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-indigo-500 mt-0.5" />
              Connected calendars will automatically block off busy times.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
