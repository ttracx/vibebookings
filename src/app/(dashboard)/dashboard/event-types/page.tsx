'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Clock, Edit, Trash2, Copy, Check, Loader2 } from 'lucide-react'

interface EventType {
  id: string
  name: string
  description: string | null
  duration: number
  color: string
  location: string | null
  isActive: boolean
  beforeBuffer: number
  afterBuffer: number
}

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    duration: 30,
    color: '#6366f1',
    location: '',
    beforeBuffer: 0,
    afterBuffer: 0,
  })

  useEffect(() => {
    fetchEventTypes()
  }, [])

  async function fetchEventTypes() {
    try {
      const res = await fetch('/api/event-types')
      if (res.ok) {
        const data = await res.json()
        setEventTypes(data)
      }
    } catch (error) {
      console.error('Error fetching event types:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/event-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        await fetchEventTypes()
        setShowForm(false)
        setForm({
          name: '',
          description: '',
          duration: 30,
          color: '#6366f1',
          location: '',
          beforeBuffer: 0,
          afterBuffer: 0,
        })
      }
    } catch (error) {
      console.error('Error creating event type:', error)
    } finally {
      setSaving(false)
    }
  }

  function copyLink(eventType: EventType) {
    const link = `${window.location.origin}/book/${eventType.id}`
    navigator.clipboard.writeText(link)
    setCopiedId(eventType.id)
    setTimeout(() => setCopiedId(null), 2000)
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
          <h2 className="text-2xl font-bold text-gray-900">Event Types</h2>
          <p className="text-gray-600">Create different meeting types with custom durations and settings.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Event Type
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Event Type</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="30 Minute Meeting"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={5}
                    max={480}
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="A quick call to discuss..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <select
                    id="location"
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  >
                    <option value="">No location</option>
                    <option value="zoom">Zoom</option>
                    <option value="google_meet">Google Meet</option>
                    <option value="phone">Phone Call</option>
                    <option value="in_person">In Person</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="beforeBuffer">Buffer Before (min)</Label>
                  <Input
                    id="beforeBuffer"
                    type="number"
                    min={0}
                    value={form.beforeBuffer}
                    onChange={(e) => setForm({ ...form, beforeBuffer: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="afterBuffer">Buffer After (min)</Label>
                  <Input
                    id="afterBuffer"
                    type="number"
                    min={0}
                    value={form.afterBuffer}
                    onChange={(e) => setForm({ ...form, afterBuffer: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2">
                  {['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full transition-transform ${
                        form.color === color ? 'scale-110 ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setForm({ ...form, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Event Type'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {eventTypes.map((eventType) => (
          <Card key={eventType.id} className="relative overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: eventType.color }}
            />
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{eventType.name}</h3>
                  {eventType.description && (
                    <p className="text-sm text-gray-500 mt-1">{eventType.description}</p>
                  )}
                </div>
                <Badge variant={eventType.isActive ? 'success' : 'secondary'}>
                  {eventType.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {eventType.duration} min
                </div>
                {eventType.location && (
                  <span className="capitalize">{eventType.location.replace('_', ' ')}</span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => copyLink(eventType)}
                >
                  {copiedId === eventType.id ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Link
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {eventTypes.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No event types yet</h3>
            <p className="text-gray-500 mb-4">
              Create your first event type to start accepting bookings.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event Type
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
