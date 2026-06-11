import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { RequireAdmin, RequireAuth } from './components/auth/guards'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Vehicles } from './pages/Vehicles'
import { VehicleDetail } from './pages/VehicleDetail'
import { MyBookings } from './pages/MyBookings'
import { Styleguide } from './pages/Styleguide'
import { ToastViewport } from './components/ui'
import { useAuthStore } from './store/auth'

function AdminPlaceholder() {
  // Replaced by the real admin dashboard in Phase 3.
  return (
    <div className="mx-auto max-w-5xl px-margin-mobile py-12 lg:px-8">
      <h1 className="text-headline-lg">Admin Dashboard</h1>
      <p className="mt-3 text-body-md text-on-surface-variant">Coming in Phase 3.</p>
    </div>
  )
}

export default function App() {
  const init = useAuthStore((s) => s.init)
  useEffect(() => {
    void init()
  }, [init])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route
            path="/my-bookings"
            element={
              <RequireAuth>
                <MyBookings />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminPlaceholder />
              </RequireAdmin>
            }
          />
          <Route path="/styleguide" element={<Styleguide />} />
        </Route>
      </Routes>
      <ToastViewport />
    </BrowserRouter>
  )
}
