import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function Skeleton({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-white/[0.08]', className)}
      aria-hidden="true"
      {...rest}
    />
  )
}
