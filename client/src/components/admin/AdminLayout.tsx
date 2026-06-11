import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthStore } from '../../store/auth'
import { Avatar } from '../ui'
import { cn } from '../../utils/cn'

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true, icon: DashboardIcon },
  { to: '/admin/vehicles', label: 'Vehicles', icon: VehiclesIcon },
  { to: '/admin/bookings', label: 'Bookings', icon: BookingsIcon },
  { to: '/admin/users', label: 'Users', icon: UsersIcon },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
]

export function AdminLayout() {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-white/[0.1] bg-surface-container/40 p-4 backdrop-blur-glass md:flex">
        <SidebarContent onNavigate={() => setMobileOpen(false)} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.1] bg-surface-container p-4 md:hidden"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
            >
              <SidebarContent onNavigate={() => setMobileOpen(false)} onSignOut={handleSignOut} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.08] bg-background/80 px-margin-mobile backdrop-blur-glass md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full p-2 text-on-surface-variant hover:bg-white/[0.06] md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
            <h2 className="text-headline-sm font-semibold">Admin Console</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden text-label-md text-on-surface-variant transition-colors hover:text-on-surface sm:block"
            >
              View site
            </Link>
            {user && (
              <div className="flex items-center gap-2">
                <Avatar src={user.photoUrl} name={user.displayName} size="sm" />
                <span className="hidden text-label-md text-on-surface-variant lg:inline">
                  {user.displayName}
                </span>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 px-margin-mobile py-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SidebarContent({
  onNavigate,
  onSignOut,
}: {
  onNavigate: () => void
  onSignOut: () => void
}) {
  const navigate = useNavigate()

  return (
    <>
      <div className="mb-6 px-2 pt-2">
        <p className="text-headline-sm font-bold tracking-tight text-primary">VehicleAppointment</p>
        <p className="mt-1 text-label-sm text-on-surface-variant">Fleet Management</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, end, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-4 py-3 text-label-md transition-all',
                isActive
                  ? 'bg-gradient-primary font-semibold text-primary-on shadow-glow-sm'
                  : 'text-on-surface-variant hover:bg-white/[0.06] hover:text-on-surface',
              )
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-2 border-t border-white/[0.08] pt-4">
        <button
          type="button"
          onClick={() => {
            onNavigate()
            navigate('/admin/vehicles', { state: { openCreate: true } })
          }}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-primary px-4 py-3 text-label-md font-semibold text-primary-on shadow-glow-sm transition-all hover:shadow-glow"
        >
          <PlusIcon />
          Add vehicle
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-label-md text-on-surface-variant transition-colors hover:bg-white/[0.06] hover:text-on-surface"
        >
          <LogoutIcon />
          Sign out
        </button>
      </div>
    </>
  )
}

function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  )
}

function VehiclesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm14 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM3 12l2-5a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 7l2 5v4H3v-4Z" strokeLinejoin="round" />
    </svg>
  )
}

function BookingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
