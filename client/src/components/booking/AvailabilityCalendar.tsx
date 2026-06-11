import { useMemo } from 'react'
import type { AppSettings } from '../../types'
import type { BookedWindow } from '../../services/api'
import { cn } from '../../utils/cn'
import { getCalendarDays, getDayStatus, isSameDay, monthLabel } from '../../utils/dates'

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export interface AvailabilityCalendarProps {
  year: number
  month: number
  selected: Date | null
  bookedWindows: BookedWindow[]
  settings: AppSettings
  onSelect: (date: Date) => void
  onMonthChange: (year: number, month: number) => void
}

export function AvailabilityCalendar({
  year,
  month,
  selected,
  bookedWindows,
  settings,
  onSelect,
  onMonthChange,
}: AvailabilityCalendarProps) {
  const days = useMemo(() => getCalendarDays(year, month), [year, month])
  const now = useMemo(() => new Date(), [year, month])

  function prevMonth() {
    const d = new Date(year, month - 1, 1)
    onMonthChange(d.getFullYear(), d.getMonth())
  }

  function nextMonth() {
    const d = new Date(year, month + 1, 1)
    onMonthChange(d.getFullYear(), d.getMonth())
  }

  return (
    <div className="glass p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-white/[0.08] hover:text-primary"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-label-md font-semibold text-on-surface">{monthLabel(year, month)}</span>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-white/[0.08] hover:text-primary"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1 text-label-sm text-on-surface-variant">
            {d}
          </span>
        ))}
        {days.map((day, i) => {
          if (!day) return <span key={`pad-${i}`} />
          const status = getDayStatus(day, bookedWindows, settings, now)
          const isSelected = selected ? isSameDay(day, selected) : false
          const disabled = status === 'disabled' || status === 'full'

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(day)}
              className={cn(
                'relative aspect-square rounded-full text-label-sm transition-all',
                disabled && 'cursor-not-allowed text-on-surface-variant/40',
                !disabled && !isSelected && 'text-on-surface hover:bg-white/[0.08]',
                status === 'partial' && !isSelected && 'text-warning',
                status === 'full' && 'line-through',
                isSelected && 'bg-gradient-primary font-semibold text-primary-on shadow-glow-sm',
              )}
            >
              {day.getDate()}
              {status === 'partial' && !isSelected && (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-warning" />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-label-sm text-on-surface-variant">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-on-surface" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-warning" /> Partially booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-on-surface-variant/40" /> Unavailable
        </span>
      </div>
    </div>
  )
}
