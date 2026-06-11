import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GlassCard, toast } from '../components/ui'
import { useAuthStore } from '../store/auth'
import { cn } from '../utils/cn'

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.17 3.57-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.93-2.91l-3.87-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.29a12 12 0 0 0 0 10.78l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.76c1.76 0 3.34.6 4.59 1.8l3.43-3.44A11.97 11.97 0 0 0 1.3 6.61l4 3.1C6.23 6.87 8.87 4.76 12 4.76Z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07Z" />
    </svg>
  )
}

export function Login() {
  const { signIn, signingIn } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  async function handleSignIn(provider: 'google' | 'facebook') {
    try {
      const user = await signIn(provider)
      toast.success(`Welcome back, ${user.displayName.split(' ')[0]}!`)
      navigate(user.role === 'ADMIN' && from === '/' ? '/admin' : from, { replace: true })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Sign-in failed.')
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-margin-mobile py-16">
      {/* Animated ambient background */}
      <motion.div
        aria-hidden
        className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/15 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-secondary/10 blur-[120px]"
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard elevated className="px-8 py-12 text-center">
          <p className="text-headline-sm font-extrabold text-primary">VehicleAppointment</p>
          <h1 className="mt-8 text-headline-lg">Welcome Back</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">Sign in to manage your bookings</p>

          <div className="mt-10 space-y-4">
            <button
              onClick={() => handleSignIn('google')}
              disabled={signingIn}
              className={cn(
                'flex h-12 w-full items-center justify-center gap-3 rounded-sm bg-white text-label-md font-semibold text-gray-800',
                'transition-all hover:brightness-95 disabled:opacity-60',
              )}
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <button
              onClick={() => handleSignIn('facebook')}
              disabled={signingIn}
              className={cn(
                'flex h-12 w-full items-center justify-center gap-3 rounded-sm bg-[#1877F2] text-label-md font-semibold text-white',
                'transition-all hover:brightness-110 disabled:opacity-60',
              )}
            >
              <FacebookIcon />
              Continue with Facebook
            </button>
          </div>

          <p className="mt-10 text-label-sm text-on-surface-variant">
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary-light underline-offset-2 hover:underline">
              Terms of Service
            </a>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  )
}
