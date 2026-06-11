import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-primary text-primary-on shadow-glow-sm hover:shadow-glow focus-visible:ring-primary/60',
  secondary:
    'bg-white/[0.08] text-on-surface border border-white/[0.14] hover:bg-white/[0.12] focus-visible:ring-white/40',
  ghost: 'text-on-surface-variant hover:text-on-surface hover:bg-white/[0.06] focus-visible:ring-white/30',
  outline:
    'border border-outline-variant text-on-surface hover:border-primary hover:text-primary-light focus-visible:ring-primary/50',
  danger: 'bg-error-container text-error-on-container text-white hover:brightness-110 focus-visible:ring-error/60',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-label-sm',
  md: 'h-11 px-6 text-label-md',
  lg: 'h-13 px-8 py-3.5 text-label-md',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:opacity-50 disabled:pointer-events-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
})
