import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, placeholder, className, id, ...rest },
  ref,
) {
  const autoId = useId()
  const selectId = id ?? autoId
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-label-md text-on-surface-variant">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'h-11 w-full appearance-none rounded-md border bg-white/[0.04] px-4 text-body-md text-on-surface',
          'transition-colors duration-200 focus:outline-none cursor-pointer',
          '[&>option]:bg-surface-high [&>option]:text-on-surface',
          error
            ? 'border-danger focus:border-danger'
            : 'border-white/[0.14] focus:border-primary focus:shadow-glow-sm',
          className,
        )}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-label-sm text-danger">{error}</p>}
    </div>
  )
})
