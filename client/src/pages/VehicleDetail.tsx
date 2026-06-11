import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../services/api'
import type { Vehicle } from '../types'
import { VEHICLE_CATEGORY_LABELS, VEHICLE_STATUS_LABELS } from '../types'
import { Badge, GlassCard, Skeleton, vehicleStatusTone } from '../components/ui'

export function VehicleDetail() {
  const { id } = useParams<{ id: string }>()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    api
      .getVehicle(id)
      .then((v) => !cancelled && setVehicle(v))
      .catch(() => !cancelled && setNotFound(true))
    return () => {
      cancelled = true
    }
  }, [id])

  if (notFound) {
    return (
      <div className="mx-auto max-w-7xl px-margin-mobile py-24 text-center lg:px-8">
        <h1 className="text-headline-lg">Vehicle not found</h1>
        <Link to="/vehicles" className="mt-4 inline-block text-label-md text-primary hover:text-primary-light">
          ← Back to fleet
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-margin-mobile py-12 lg:px-8">
      <Link
        to="/vehicles"
        className="inline-flex items-center gap-1.5 text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5m6 6-6-6 6-6" />
        </svg>
        Back to fleet
      </Link>

      {!vehicle ? (
        <div className="mt-6 space-y-6">
          <Skeleton className="aspect-[21/9] w-full" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Hero */}
          <div className="relative mt-6 overflow-hidden rounded-md">
            <div className="aspect-[16/9] md:aspect-[21/9]">
              {vehicle.imageUrl ? (
                <img src={vehicle.imageUrl} alt={vehicle.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-high text-on-surface-variant">
                  No photo
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="info">{VEHICLE_CATEGORY_LABELS[vehicle.category]}</Badge>
                <Badge tone={vehicleStatusTone[vehicle.status]}>
                  {VEHICLE_STATUS_LABELS[vehicle.status]}
                </Badge>
              </div>
              <h1 className="mt-3 text-headline-lg md:text-headline-xl">{vehicle.name}</h1>
              {vehicle.description && (
                <p className="mt-3 max-w-2xl text-body-md text-on-surface-variant md:text-body-lg">
                  {vehicle.description}
                </p>
              )}
            </div>
          </div>

          {/* Booking panel — interactive calendar + time picker arrive in Phase 2 */}
          <GlassCard elevated className="mt-8 p-6 md:p-10">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h2 className="text-headline-md text-primary">Book This Vehicle</h2>
              <p className="text-label-md text-on-surface-variant">12-hour rental window</p>
            </div>

            {vehicle.status === 'AVAILABLE' ? (
              <div className="mt-8 grid gap-8 lg:grid-cols-2">
                <div className="glass flex aspect-square max-h-96 items-center justify-center p-8 text-center lg:aspect-auto">
                  <div>
                    <p className="text-headline-sm text-on-surface-variant">Availability calendar</p>
                    <p className="mt-2 text-body-md text-on-surface-variant/70">Coming in Phase 2</p>
                  </div>
                </div>
                <div className="glass flex items-center justify-center p-8 text-center">
                  <div>
                    <p className="text-headline-sm text-on-surface-variant">Start-time picker</p>
                    <p className="mt-2 text-body-md text-on-surface-variant/70">
                      Pick a start time — the end time is auto-calculated (+12h). Coming in Phase 2.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-6 text-body-md text-on-surface-variant">
                This vehicle is currently{' '}
                <span className="text-warning">{VEHICLE_STATUS_LABELS[vehicle.status].toLowerCase()}</span>{' '}
                and cannot be booked.
              </p>
            )}
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}
