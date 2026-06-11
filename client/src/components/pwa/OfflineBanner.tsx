import { useEffect, useState } from 'react'

export function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  if (!offline) return null

  return (
    <div
      role="status"
      className="bg-warning/15 border-b border-warning/30 px-4 py-2 text-center text-label-sm text-warning"
    >
      You are offline. Some features may be unavailable.
    </div>
  )
}
