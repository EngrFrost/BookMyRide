import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, id, ...rest },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-label-md text-on-surface-variant">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'h-11 w-full rounded-md border bg-white/[0.04] px-4 text-body-md text-on-surface placeholder:text-on-surface-variant/50',
          'transition-colors duration-200 focus:outline-none',
          error
            ? 'border-danger focus:border-danger'
            : 'border-white/[0.14] focus:border-primary focus:shadow-glow-sm',
          className,
        )}
        {...rest}
      />
      {error && <p className="text-label-sm text-danger">{error}</p>}
    </div>
  )
})
