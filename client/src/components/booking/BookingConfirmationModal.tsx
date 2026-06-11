import type { Vehicle } from '../../types'
import { Button, Modal } from '../ui'
import { formatBookingWindow, formatDate } from '../../utils/dates'

export interface BookingConfirmationModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  vehicle: Vehicle
  startTime: string
  endTime: string
}

export function BookingConfirmationModal({
  open,
  onClose,
  onConfirm,
  loading,
  vehicle,
  startTime,
  endTime,
}: BookingConfirmationModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Confirm booking"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} loading={loading}>
            Confirm booking
          </Button>
        </>
      }
    >
      <div className="space-y-3 text-on-surface">
        <p>
          <span className="text-on-surface-variant">Vehicle:</span>{' '}
          <strong>{vehicle.name}</strong>
        </p>
        <p>
          <span className="text-on-surface-variant">Date:</span> {formatDate(startTime)}
        </p>
        <p>
          <span className="text-on-surface-variant">Window:</span>{' '}
          {formatBookingWindow(startTime, endTime)}
        </p>
        <p className="text-label-sm text-on-surface-variant">
          You can cancel up to 24 hours before the start time. This reservation is confirmed
          immediately.
        </p>
      </div>
    </Modal>
  )
}
