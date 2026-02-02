'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link2, Copy, Check, ExternalLink, Share2 } from 'lucide-react'

interface EventType {
  id: string
  name: string
  duration: number
  color: string
}

export default function BookingLinksPage() {
  const { data: session } = useSession()
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
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
    fetchEventTypes()
  }, [])

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const profileSlug = session?.user?.email?.split('@')[0] || 'user'

  function copyLink(id: string, link: string) {
    navigator.clipboard.writeText(link)
    setCopiedId(id)
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Booking Links</h2>
        <p className="text-gray-600">Share these links to let others book time with you.</p>
      </div>

      {/* Profile Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            Your Profile Link
          </CardTitle>
          <CardDescription>
            Share this link to let people see all your available event types.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              readOnly
              value={`${baseUrl}/book/${profileSlug}`}
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              onClick={() => copyLink('profile', `${baseUrl}/book/${profileSlug}`)}
            >
              {copiedId === 'profile' ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <Button variant="outline" asChild>
              <a href={`/book/${profileSlug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Event Type Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-indigo-600" />
            Event Type Links
          </CardTitle>
          <CardDescription>
            Direct links to specific event types for quick booking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {eventTypes.length === 0 ? (
            <div className="text-center py-8">
              <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Create an event type to get a booking link.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {eventTypes.map((eventType) => {
                const link = `${baseUrl}/book/${eventType.id}`
                return (
                  <div
                    key={eventType.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: eventType.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{eventType.name}</p>
                      <p className="text-sm text-gray-500">{eventType.duration} minutes</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyLink(eventType.id, link)}
                      >
                        {copiedId === eventType.id ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Embed Code */}
      <Card>
        <CardHeader>
          <CardTitle>Embed on Your Website</CardTitle>
          <CardDescription>
            Add a booking widget to your website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-900 rounded-lg">
              <pre className="text-sm text-green-400 overflow-x-auto">
{`<!-- VibeBookings Widget -->
<iframe 
  src="${baseUrl}/book/${profileSlug}?embed=true"
  width="100%" 
  height="600"
  frameborder="0"
></iframe>`}
              </pre>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                const code = `<iframe src="${baseUrl}/book/${profileSlug}?embed=true" width="100%" height="600" frameborder="0"></iframe>`
                navigator.clipboard.writeText(code)
                setCopiedId('embed')
                setTimeout(() => setCopiedId(null), 2000)
              }}
            >
              {copiedId === 'embed' ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Embed Code
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
