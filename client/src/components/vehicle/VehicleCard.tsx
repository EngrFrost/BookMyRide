import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Badge, Button, GlassCard, vehicleStatusTone } from '../ui'
import {
  VEHICLE_CATEGORY_LABELS,
  VEHICLE_STATUS_LABELS,
  type Vehicle,
} from '../../types'

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const navigate = useNavigate()
  const bookable = vehicle.status === 'AVAILABLE'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      layout
    >
      <GlassCard hoverable className="flex h-full flex-col overflow-hidden !p-0">
        <Link to={`/vehicles/${vehicle.id}`} className="relative block aspect-[16/10] overflow-hidden">
          {vehicle.imageUrl ? (
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              loading="lazy"
              className={`h-full w-full object-cover transition-transform duration-500 hover:scale-105 ${bookable ? '' : 'opacity-40 grayscale'}`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-high text-on-surface-variant">
              No photo
            </div>
          )}
          <Badge tone="info" className="absolute right-3 top-3 backdrop-blur-sm">
            {VEHICLE_CATEGORY_LABELS[vehicle.category]}
          </Badge>
          {!bookable && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="glass-elevated px-5 py-2.5 text-headline-sm text-on-surface-variant">
                {vehicle.status === 'MAINTENANCE' ? 'In Maintenance' : 'Retired'}
              </span>
            </span>
          )}
        </Link>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <Link to={`/vehicles/${vehicle.id}`}>
              <h2 className={`text-headline-sm ${bookable ? '' : 'text-on-surface-variant'}`}>
                {vehicle.name}
              </h2>
            </Link>
            <Badge tone={vehicleStatusTone[vehicle.status]}>
              {VEHICLE_STATUS_LABELS[vehicle.status]}
            </Badge>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
            <p className="line-clamp-1 text-label-sm text-on-surface-variant">
              {vehicle.description ?? '—'}
            </p>
            {bookable ? (
              <Button size="sm" onClick={() => navigate(`/vehicles/${vehicle.id}`)} className="shrink-0">
                Book Now
              </Button>
            ) : (
              <Button size="sm" variant="secondary" disabled className="shrink-0">
                Unavailable
              </Button>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
