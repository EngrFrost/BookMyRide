import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthStore } from '../../store/auth'
import { Avatar, Button } from '../ui'
import { cn } from '../../utils/cn'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/vehicles', label: 'Vehicles' },
  { to: '/my-bookings', label: 'My Bookings', authOnly: true },
]

function BrandLogo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img src="/favicon.svg" alt="" className="h-8 w-8" />
      <span className="text-headline-sm font-extrabold tracking-tight text-primary">
        Vehicle<span className="text-on-surface">Appointment</span>
      </span>
    </Link>
  )
}

export function Navbar() {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const visibleLinks = navLinks.filter((l) => !l.authOnly || user)

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-background/80 backdrop-blur-glass">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-margin-mobile lg:px-8">
        <BrandLogo />

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-4 py-2 text-label-md transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:bg-white/[0.06] hover:text-on-surface',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-white/[0.06]"
                aria-label="Account menu"
              >
                <Avatar src={user.photoUrl} name={user.displayName} size="sm" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    className="glass-elevated absolute right-0 top-12 w-56 p-2"
                  >
                    <div className="border-b border-white/[0.08] px-3 py-2">
                      <p className="truncate text-label-md text-on-surface">{user.displayName}</p>
                      <p className="truncate text-label-sm text-on-surface-variant">{user.email}</p>
                    </div>
                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="mt-1 block rounded-sm px-3 py-2 text-label-md text-on-surface-variant transition-colors hover:bg-white/[0.06] hover:text-on-surface"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={async () => {
                        setMenuOpen(false)
                        await signOut()
                        navigate('/')
                      }}
                      className="block w-full rounded-sm px-3 py-2 text-left text-label-md text-danger transition-colors hover:bg-white/[0.06]"
                    >
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden text-label-md text-on-surface-variant transition-colors hover:text-on-surface md:block">
                Sign In
              </Link>
              <Button size="sm" onClick={() => navigate('/vehicles')}>
                Book Now
              </Button>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="rounded-full p-2 text-on-surface-variant hover:bg-white/[0.06] md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/[0.08] md:hidden"
          >
            <div className="flex flex-col gap-1 px-margin-mobile py-3">
              {visibleLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-sm px-3 py-2.5 text-label-md',
                      isActive ? 'bg-white/[0.06] text-primary' : 'text-on-surface-variant',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {!user && (
                <NavLink
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-sm px-3 py-2.5 text-label-md text-on-surface-variant"
                >
                  Sign In
                </NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
