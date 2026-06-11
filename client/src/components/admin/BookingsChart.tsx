import { GlassCard } from '../ui'

export interface BookingsChartProps {
  data: { date: string; count: number }[]
}

export function BookingsChart({ data }: BookingsChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <GlassCard className="flex h-full flex-col !p-5">
      <h3 className="text-headline-sm font-semibold">Bookings (last 7 days)</h3>
      <div className="mt-6 flex h-44 items-end justify-between gap-2">
        {data.map((d) => {
          const barPx = Math.max(Math.round((d.count / max) * 140), d.count > 0 ? 12 : 4)
          const label = new Date(d.date + 'T12:00:00').toLocaleDateString(undefined, {
            weekday: 'short',
          })
          return (
            <div key={d.date} className="flex flex-1 flex-col items-center justify-end gap-2">
              <span className="text-label-sm text-on-surface-variant">{d.count}</span>
              <div
                className="w-full max-w-[2.5rem] rounded-t-sm bg-gradient-primary transition-all"
                style={{ height: barPx }}
                title={`${d.date}: ${d.count} booking(s)`}
              />
              <span className="text-label-sm text-on-surface-variant">{label}</span>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
