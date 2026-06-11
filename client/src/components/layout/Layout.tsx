import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { PageTransition } from './PageTransition'
import { OfflineBanner } from '../pwa/OfflineBanner'
import { InstallPrompt } from '../pwa/InstallPrompt'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-on"
      >
        Skip to content
      </a>
      <OfflineBanner />
      <Navbar />
      <main id="main-content" role="main" tabIndex={-1} className="flex-1 outline-none">
        <PageTransition />
      </main>
      <Footer />
      <InstallPrompt />
    </div>
  )
}
