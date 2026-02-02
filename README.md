# VibeBookings

Modern appointment scheduling platform built with Next.js 15, TypeScript, Prisma, and Neon PostgreSQL.

## Features

- 📅 **Calendar Integration** - Sync with Google Calendar, Outlook, and iCal
- ⏰ **Availability Management** - Set working hours, buffer times, and custom availability
- 🔗 **Shareable Booking Links** - Create custom booking pages for clients
- 🔔 **Automated Reminders** - Email and SMS reminders to reduce no-shows
- 🌍 **Timezone Support** - Automatic timezone detection and conversion
- 👥 **Team Scheduling** - Round-robin and collective booking for teams

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Neon PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js
- **Payments**: Stripe ($29/mo Pro plan)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/ttracx/vibebookings.git
   cd vibebookings
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. Push database schema:
   ```bash
   bunx prisma db push
   ```

5. Run the development server:
   ```bash
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth.js secret key
- `NEXTAUTH_URL` - Your app URL
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_PRICE_ID` - Stripe price ID for Pro plan
- `NEXT_PUBLIC_APP_URL` - Public app URL

## Pricing

- **Free**: 1 event type, 10 bookings/month
- **Pro** ($29/mo): Unlimited everything + team features

## License

MIT
