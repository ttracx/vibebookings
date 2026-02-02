import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Users, Bell, Globe, Link2, Zap, Shield, Check } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">VibeBookings</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Smart Scheduling Made Simple
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Schedule Meetings
            <br />
            <span className="text-indigo-600">Without the Back-and-Forth</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            VibeBookings is a modern appointment scheduling platform that helps you manage your calendar, 
            share booking links, and automate reminders—so you can focus on what matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Scheduling for Free
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Schedule Smarter</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features that make appointment scheduling effortless for you and your clients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="w-6 h-6" />}
              title="Calendar Integration"
              description="Sync with Google Calendar, Outlook, and iCal to prevent double-bookings automatically."
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="Availability Management"
              description="Set your working hours, buffer times, and custom availability for different event types."
            />
            <FeatureCard
              icon={<Link2 className="w-6 h-6" />}
              title="Shareable Booking Links"
              description="Create custom booking pages that clients can use to schedule appointments 24/7."
            />
            <FeatureCard
              icon={<Bell className="w-6 h-6" />}
              title="Automated Reminders"
              description="Send email and SMS reminders to reduce no-shows and keep everyone on schedule."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6" />}
              title="Timezone Support"
              description="Automatic timezone detection ensures meetings are always scheduled correctly."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Team Scheduling"
              description="Coordinate availability across your team with round-robin and collective booking."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600">Start free, upgrade when you&apos;re ready.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature>1 event type</PricingFeature>
                <PricingFeature>Up to 10 bookings/month</PricingFeature>
                <PricingFeature>Email notifications</PricingFeature>
                <PricingFeature>Basic availability settings</PricingFeature>
              </ul>
              <Link href="/register">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                POPULAR
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-indigo-200 mb-6">For professionals and teams</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-indigo-200">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature light>Unlimited event types</PricingFeature>
                <PricingFeature light>Unlimited bookings</PricingFeature>
                <PricingFeature light>Email & SMS reminders</PricingFeature>
                <PricingFeature light>Calendar integrations</PricingFeature>
                <PricingFeature light>Team scheduling</PricingFeature>
                <PricingFeature light>Custom branding</PricingFeature>
                <PricingFeature light>Priority support</PricingFeature>
              </ul>
              <Link href="/register">
                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Simplify Your Scheduling?
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            Join thousands of professionals who save hours every week with VibeBookings.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-8 py-6">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-indigo-500" />
              <span className="text-lg font-semibold text-white">VibeBookings</span>
            </div>
            <p>&copy; 2026 VibeBookings. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function PricingFeature({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <li className="flex items-center gap-2">
      <Check className={`w-5 h-5 ${light ? 'text-indigo-200' : 'text-green-500'}`} />
      <span className={light ? 'text-indigo-100' : 'text-gray-700'}>{children}</span>
    </li>
  )
}
