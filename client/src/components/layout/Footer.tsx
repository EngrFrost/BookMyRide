import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.08]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-margin-mobile py-8 text-label-sm text-on-surface-variant md:flex-row lg:px-8">
        <p>© {new Date().getFullYear()} VehicleAppointment. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="#" className="transition-colors hover:text-on-surface">Privacy Policy</Link>
          <Link to="#" className="transition-colors hover:text-on-surface">Terms of Service</Link>
          <Link to="#" className="transition-colors hover:text-on-surface">Contact Us</Link>
        </div>
      </div>
    </footer>
  )
}
