import { useEffect, useState } from 'react'
import { Button, GlassCard } from '../ui'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!deferred || dismissed) return null

  async function handleInstall() {
    await deferred!.prompt()
    const { outcome } = await deferred!.userChoice
    setDeferred(null)
    if (outcome === 'dismissed') setDismissed(true)
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md md:left-auto md:right-6">
      <GlassCard elevated className="flex items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-label-md font-semibold text-on-surface">Install Bookmyride</p>
          <p className="text-label-sm text-on-surface-variant">Add to your home screen for quick access.</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
            Later
          </Button>
          <Button size="sm" onClick={() => void handleInstall()}>
            Install
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}
