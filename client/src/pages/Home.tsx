import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, GlassCard } from '../components/ui'
import { VEHICLE_CATEGORY_LABELS, type VehicleCategory } from '../types'

const categories: {
  category: VehicleCategory
  blurb: string
  icon: string
}[] = [
  { category: 'BIKE', blurb: 'Agile urban transport for quick, solo maneuvers.', icon: 'M5 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm14 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM5 16l4-8h3m-1.5 3H16l3 5M13 8l-1-2h3' },
  { category: 'FOUR_SEATER', blurb: 'Premium sedans offering comfort and sophisticated style.', icon: 'M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm14 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM3 12l2-5a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 7l2 5v4H3v-4Z' },
  { category: 'SEVEN_SEATER', blurb: 'Spacious vans for group transport without compromising luxury.', icon: 'M3 17V8a2 2 0 0 1 2-2h12l4 6v5M3 17h18M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z' },
]

const steps = [
  { title: 'Sign In', description: 'Access your secure profile to begin the reservation process.' },
  { title: 'Pick Your Vehicle', description: 'Select from our exclusive fleet of bikes, sedans, and vans.' },
  { title: 'Book Your Slot', description: 'Confirm your 12-hour window and receive instant approval.' },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5 },
}

export function Home() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=70)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-margin-mobile py-24 text-center md:py-36 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl text-headline-xl-mobile md:text-headline-xl"
          >
            Book Your Ride, <span className="text-gradient-primary">Anytime</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 max-w-xl text-body-lg text-on-surface-variant"
          >
            Reserve premium bikes, sedans, and vans for 12-hour windows with just a few clicks.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-9"
          >
            <Button size="lg" onClick={() => navigate('/vehicles')}>
              Browse Vehicles
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-margin-mobile py-16 lg:px-8">
        <motion.h2 {...fadeUp} className="text-center text-headline-lg">
          Select Your <span className="text-primary">Class</span>
        </motion.h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {categories.map((c, i) => (
            <motion.div key={c.category} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }}>
              <GlassCard hoverable className="flex h-full flex-col p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={c.icon} />
                  </svg>
                </span>
                <h3 className="mt-5 text-headline-sm">{VEHICLE_CATEGORY_LABELS[c.category]}</h3>
                <p className="mt-2 flex-1 text-body-md text-on-surface-variant">{c.blurb}</p>
                <Link
                  to={`/vehicles?category=${c.category}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-label-md text-primary transition-colors hover:text-primary-light"
                >
                  View Available
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-margin-mobile py-16 lg:px-8">
        <motion.h2 {...fadeUp} className="text-center text-headline-lg">
          How It Works
        </motion.h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div key={step.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }}>
              <GlassCard className="h-full p-8 text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-label-md font-bold text-primary-on">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-headline-sm">{step.title}</h3>
                <p className="mt-2 text-body-md text-on-surface-variant">{step.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="mx-auto max-w-7xl px-margin-mobile pb-20 lg:px-8">
        <motion.div {...fadeUp}>
          <GlassCard elevated className="flex flex-col items-center gap-6 p-10 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h2 className="text-headline-md">Ready to hit the road?</h2>
              <p className="mt-1 text-body-md text-on-surface-variant">
                Your next ride is a few clicks away.
              </p>
            </div>
            <Button size="lg" onClick={() => navigate('/vehicles')}>
              Book Now
            </Button>
          </GlassCard>
        </motion.div>
      </section>
    </div>
  )
}
