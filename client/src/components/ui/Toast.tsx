import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { create } from 'zustand'
import { cn } from '../../utils/cn'

type ToastTone = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

interface ToastStore {
  toasts: ToastItem[]
  push: (message: string, tone?: ToastTone) => void
  dismiss: (id: number) => void
}

let nextId = 1

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (message, tone = 'info') => {
    const id = nextId++
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 4500)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

/** Convenience: `toast.success('Booked!')` from anywhere. */
export const toast = {
  success: (m: string) => useToastStore.getState().push(m, 'success'),
  error: (m: string) => useToastStore.getState().push(m, 'error'),
  info: (m: string) => useToastStore.getState().push(m, 'info'),
}

const toneClasses: Record<ToastTone, string> = {
  success: 'border-success/40 text-success',
  error: 'border-danger/40 text-danger',
  info: 'border-primary/40 text-primary-light',
}

export function ToastViewport() {
  const { toasts, dismiss } = useToastStore()
  return createPortal(
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => dismiss(t.id)}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className={cn(
              'glass-elevated pointer-events-auto flex items-center gap-3 px-4 py-3 text-left text-label-md',
              toneClasses[t.tone],
            )}
          >
            <span className="text-on-surface">{t.message}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  )
}
