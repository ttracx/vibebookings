'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, UserPlus, Crown, Shield, User } from 'lucide-react'

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team</h2>
          <p className="text-gray-600">Manage your team members and scheduling.</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Add team members to enable round-robin and collective scheduling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Invite team members to coordinate schedules and enable advanced booking options.
            </p>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Your First Team Member
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Features</CardTitle>
          <CardDescription>
            Available with the Pro plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">Round-Robin Scheduling</h4>
              <p className="text-sm text-gray-600">
                Distribute meetings evenly across team members based on availability.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">Collective Events</h4>
              <p className="text-sm text-gray-600">
                Find times when multiple team members are all available.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">Team Calendar</h4>
              <p className="text-sm text-gray-600">
                View all team members&apos; schedules in one place.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">Admin Controls</h4>
              <p className="text-sm text-gray-600">
                Manage roles, permissions, and team settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Crown className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Owner</p>
                <p className="text-sm text-gray-600">
                  Full access to all settings, billing, and team management.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Admin</p>
                <p className="text-sm text-gray-600">
                  Can manage team members and event types, but not billing.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200">
              <div className="p-2 bg-gray-100 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Member</p>
                <p className="text-sm text-gray-600">
                  Can manage their own bookings and availability.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
