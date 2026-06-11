import { useState } from 'react'
import {
  Avatar,
  Badge,
  Button,
  GlassCard,
  Input,
  Modal,
  Select,
  Skeleton,
  Tabs,
  toast,
  bookingStatusTone,
  vehicleStatusTone,
} from '../components/ui'
import {
  BOOKING_STATUS_LABELS,
  VEHICLE_CATEGORY_LABELS,
  VEHICLE_STATUS_LABELS,
  type BookingStatus,
  type VehicleStatus,
} from '../types'

export function Styleguide() {
  const [modalOpen, setModalOpen] = useState(false)
  const [tab, setTab] = useState<'ALL' | 'BIKE' | 'FOUR_SEATER' | 'SEVEN_SEATER'>('ALL')

  return (
    <div className="mx-auto max-w-5xl px-margin-mobile py-12 lg:px-0">
      <header className="mb-12">
        <p className="text-label-md uppercase tracking-widest text-primary-light">Z Rentals</p>
        <h1 className="mt-2 text-headline-xl-mobile md:text-headline-xl">
          Design System <span className="text-gradient-primary">Styleguide</span>
        </h1>
        <p className="mt-3 max-w-xl text-body-lg text-on-surface-variant">
          Dev-only reference for the VehicleAppointment UI kit. Dark glassmorphism, golden amber
          gradients, Plus Jakarta Sans.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-headline-md">Typography</h2>
        <GlassCard className="space-y-3 p-6">
          <p className="text-headline-xl">Headline XL</p>
          <p className="text-headline-lg">Headline LG</p>
          <p className="text-headline-md">Headline MD</p>
          <p className="text-headline-sm">Headline SM</p>
          <p className="text-body-lg">Body LG — The quick brown fox jumps over the lazy dog.</p>
          <p className="text-body-md">Body MD — The quick brown fox jumps over the lazy dog.</p>
          <p className="text-label-md">Label MD — VEHICLE SPECS</p>
          <p className="text-label-sm">Label SM — timestamp</p>
        </GlassCard>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-headline-md">Buttons</h2>
        <GlassCard className="flex flex-wrap items-center gap-4 p-6">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </GlassCard>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-headline-md">Badges</h2>
        <GlassCard className="space-y-4 p-6">
          <div className="flex flex-wrap gap-3">
            {(Object.keys(VEHICLE_STATUS_LABELS) as VehicleStatus[]).map((s) => (
              <Badge key={s} tone={vehicleStatusTone[s]}>
                {VEHICLE_STATUS_LABELS[s]}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[]).map((s) => (
              <Badge key={s} tone={bookingStatusTone[s]}>
                {BOOKING_STATUS_LABELS[s]}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge tone="primary">Primary</Badge>
            <Badge tone="info">4-Seater</Badge>
            <Badge tone="neutral">Neutral</Badge>
          </div>
        </GlassCard>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-headline-md">Tabs</h2>
        <Tabs
          tabs={[
            { value: 'ALL', label: 'All' },
            { value: 'BIKE', label: VEHICLE_CATEGORY_LABELS.BIKE },
            { value: 'FOUR_SEATER', label: VEHICLE_CATEGORY_LABELS.FOUR_SEATER },
            { value: 'SEVEN_SEATER', label: VEHICLE_CATEGORY_LABELS.SEVEN_SEATER },
          ]}
          value={tab}
          onChange={setTab}
        />
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-headline-md">Forms</h2>
        <GlassCard className="grid gap-6 p-6 md:grid-cols-2">
          <Input label="Search vehicles" placeholder="e.g. Toyota Vios" />
          <Input label="With error" placeholder="..." error="This field is required." />
          <Select
            label="Start time"
            options={[
              { value: '06:00', label: '6:00 AM' },
              { value: '14:00', label: '2:00 PM' },
            ]}
          />
          <Select label="Category" placeholder="Pick one" defaultValue="" options={[]} />
        </GlassCard>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-headline-md">Cards, Avatars &amp; Skeletons</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <GlassCard hoverable className="p-6">
            <h3 className="text-headline-sm">Hoverable glass card</h3>
            <p className="mt-2 text-body-md text-on-surface-variant">Hover me — lifts and brightens.</p>
          </GlassCard>
          <GlassCard elevated className="flex items-center gap-4 p-6">
            <Avatar name="Alex Rivera" src="https://i.pravatar.cc/150?img=12" size="lg" />
            <Avatar name="Maria Santos" size="lg" />
          </GlassCard>
          <GlassCard className="space-y-3 p-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </GlassCard>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-headline-md">Modal &amp; Toasts</h2>
        <GlassCard className="flex flex-wrap gap-4 p-6">
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Button variant="secondary" onClick={() => toast.success('Booking confirmed!')}>
            Success toast
          </Button>
          <Button variant="secondary" onClick={() => toast.error('That slot is already booked.')}>
            Error toast
          </Button>
        </GlassCard>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm booking"
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setModalOpen(false)
                  toast.success('Booking confirmed!')
                }}
              >
                Confirm
              </Button>
            </>
          }
        >
          Toyota Vios #1 · Tomorrow, 6:00 AM – 6:00 PM. You can cancel up to 24 hours before the
          start time.
        </Modal>
      </section>
    </div>
  )
}
