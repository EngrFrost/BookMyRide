import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../services/api'
import type { Vehicle, VehicleCategory } from '../types'
import { VEHICLE_CATEGORY_LABELS } from '../types'
import { ErrorState, Input, Skeleton, Tabs } from '../components/ui'
import { VehicleCard } from '../components/vehicle/VehicleCard'

type CategoryFilter = 'ALL' | VehicleCategory

const categoryTabs: { value: CategoryFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'BIKE', label: `${VEHICLE_CATEGORY_LABELS.BIKE}s` },
  { value: 'FOUR_SEATER', label: `${VEHICLE_CATEGORY_LABELS.FOUR_SEATER}s` },
  { value: 'SEVEN_SEATER', label: `${VEHICLE_CATEGORY_LABELS.SEVEN_SEATER}s` },
]

export function Vehicles() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const category: CategoryFilter =
    categoryParam === 'BIKE' || categoryParam === 'FOUR_SEATER' || categoryParam === 'SEVEN_SEATER'
      ? categoryParam
      : 'ALL'

  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const load = () => {
    setError(null)
    setVehicles(null)
    return api.listVehicles().then(setVehicles).catch(() => {
      setError('Could not load vehicles. Check your connection and try again.')
      setVehicles([])
    })
  }

  useEffect(() => {
    void load()
  }, [])

  const filtered = useMemo(() => {
    if (!vehicles) return null
    const q = search.trim().toLowerCase()
    return vehicles.filter(
      (v) =>
        (category === 'ALL' || v.category === category) &&
        (!q || v.name.toLowerCase().includes(q) || v.description?.toLowerCase().includes(q)),
    )
  }, [vehicles, category, search])

  return (
    <div className="mx-auto max-w-7xl px-margin-mobile py-12 lg:px-8">
      <h1 className="text-headline-lg md:text-headline-xl">Our Fleet</h1>
      <p className="mt-3 max-w-xl text-body-lg text-on-surface-variant">
        Browse and book from our curated collection of premium vehicles, meticulously maintained
        for your journey.
      </p>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs
          tabs={categoryTabs}
          value={category}
          onChange={(value) =>
            setSearchParams(value === 'ALL' ? {} : { category: value }, { replace: true })
          }
        />
        <div className="md:w-72">
          <Input
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search vehicles"
          />
        </div>
      </div>

      {error && (
        <div className="mt-8">
          <ErrorState message={error} onRetry={() => void load()} />
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {!error &&
          (filtered === null
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[16/10] w-full" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))
            : filtered.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />))}
      </div>

      {!error && filtered !== null && filtered.length === 0 && (
        <div className="glass mt-8 p-12 text-center">
          <p className="text-headline-sm text-on-surface-variant">No vehicles found</p>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Try a different category or search term.
          </p>
        </div>
      )}
    </div>
  )
}
