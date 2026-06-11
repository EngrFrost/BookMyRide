import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import type { AppSettings } from '../../types'
import { Button, GlassCard, Input, Skeleton, toast } from '../../components/ui'

export function AdminSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.getSettings().then(setSettings)
  }, [])

  function updateField<K extends keyof AppSettings>(key: K, value: number) {
    setSettings((s) => (s ? { ...s, [key]: value } : s))
  }

  async function handleSave() {
    if (!settings) return
    setSaving(true)
    try {
      const updated = await api.updateSettings(settings)
      setSettings(updated)
      toast.success('Settings saved. Booking rules updated immediately.')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  if (!settings) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full max-w-lg" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-headline-lg md:text-headline-xl">
        App <span className="text-primary">Settings</span>
      </h1>
      <p className="mt-2 text-body-md text-on-surface-variant">
        Changes apply immediately to mock booking validation.
      </p>

      <GlassCard className="mt-8 max-w-lg space-y-5 !p-6">
        <Input
          label="Max advance booking days"
          type="number"
          min={1}
          max={30}
          value={settings.maxAdvanceBookingDays}
          onChange={(e) => updateField('maxAdvanceBookingDays', Number(e.target.value))}
        />
        <Input
          label="Max active bookings per customer"
          type="number"
          min={1}
          max={10}
          value={settings.maxActiveBookingsPerUser}
          onChange={(e) => updateField('maxActiveBookingsPerUser', Number(e.target.value))}
        />
        <Input
          label="Min hours before booking (lead time)"
          type="number"
          min={1}
          max={168}
          value={settings.minHoursBeforeBooking}
          onChange={(e) => updateField('minHoursBeforeBooking', Number(e.target.value))}
        />
        <Input
          label="Cancellation window (hours before start)"
          type="number"
          min={1}
          max={168}
          value={settings.cancellationWindowHours}
          onChange={(e) => updateField('cancellationWindowHours', Number(e.target.value))}
        />
        <Button onClick={handleSave} loading={saving}>
          Save settings
        </Button>
      </GlassCard>
    </div>
  )
}
