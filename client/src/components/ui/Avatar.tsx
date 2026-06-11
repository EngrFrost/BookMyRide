import { cn } from '../../utils/cn'

export interface AvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-label-sm',
  md: 'h-10 w-10 text-label-md',
  lg: 'h-14 w-14 text-body-lg',
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  return src ? (
    <img
      src={src}
      alt={name}
      className={cn('rounded-full object-cover ring-1 ring-white/[0.18]', sizeClasses[size], className)}
    />
  ) : (
    <div
      aria-label={name}
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-primary font-semibold text-primary-on ring-1 ring-white/[0.18]',
        sizeClasses[size],
        className,
      )}
    >
      {initials(name)}
    </div>
  )
}
