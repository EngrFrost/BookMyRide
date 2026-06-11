import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, initializing } = useAuthStore()
  const location = useLocation()
  if (initializing) return <FullPageSpinner />
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return children
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, initializing } = useAuthStore()
  if (initializing) return <FullPageSpinner />
  if (!user) return <Navigate to="/login" state={{ from: '/admin' }} replace />
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}
