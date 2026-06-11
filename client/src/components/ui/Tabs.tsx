import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface TabOption<T extends string = string> {
  value: T
  label: string
}

export interface TabsProps<T extends string = string> {
  tabs: TabOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function Tabs<T extends string>({ tabs, value, onChange, className }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn('glass inline-flex items-center gap-1 rounded-full p-1', className)}
    >
      {tabs.map((tab) => {
        const active = tab.value === value
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative rounded-full px-5 py-2 text-label-md transition-colors duration-200',
              active ? 'text-primary-on' : 'text-on-surface-variant hover:text-on-surface',
            )}
          >
            {active && (
              <motion.span
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-full bg-gradient-primary shadow-glow-sm"
                transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
