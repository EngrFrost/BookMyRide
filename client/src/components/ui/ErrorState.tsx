import { Button } from './Button'
import { GlassCard } from './GlassCard'

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <GlassCard className="p-10 text-center">
      <p className="text-body-md text-on-surface-variant">{message}</p>
      {onRetry && (
        <Button className="mt-6" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </GlassCard>
  )
}
