import { useState } from 'react'
import type { Booking } from '../../types'
import { Button, Input, Modal } from '../ui'
import { formatBookingWindow, formatDate } from '../../utils/dates'

export interface CancelBookingModalProps {
  booking: Booking | null
  open: boolean
  onClose: () => void
  onConfirm: (reason?: string) => Promise<void>
}

export function CancelBookingModal({ booking, open, onClose, onConfirm }: CancelBookingModalProps) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      await onConfirm(reason.trim() || undefined)
      setReason('')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    if (loading) return
    setReason('')
    onClose()
  }

  if (!booking) return null

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Cancel booking"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            Keep booking
          </Button>
          <Button variant="danger" onClick={handleConfirm} loading={loading}>
            Cancel booking
          </Button>
        </>
      }
    >
      <p className="text-on-surface">
        Cancel <strong>{booking.vehicle?.name}</strong> on {formatDate(booking.startTime)} (
        {formatBookingWindow(booking.startTime, booking.endTime)})?
      </p>
      <p className="mt-3 text-label-sm text-on-surface-variant">
        This frees the vehicle&apos;s time slot immediately.
      </p>
      <div className="mt-4">
        <Input
          label="Reason (optional)"
          placeholder="e.g. Change of plans"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>
    </Modal>
  )
}
