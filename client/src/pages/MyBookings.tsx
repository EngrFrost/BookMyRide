import { GlassCard } from '../components/ui'

// Full bookings list with cancel flow arrives in Phase 2.
export function MyBookings() {
  return (
    <div className="mx-auto max-w-5xl px-margin-mobile py-12 lg:px-8">
      <h1 className="text-headline-lg md:text-headline-xl">My Bookings</h1>
      <GlassCard className="mt-8 p-12 text-center">
        <p className="text-headline-sm text-on-surface-variant">Booking management coming in Phase 2</p>
        <p className="mt-2 text-body-md text-on-surface-variant/70">
          You'll see your upcoming and past reservations here.
        </p>
      </GlassCard>
    </div>
  )
}
