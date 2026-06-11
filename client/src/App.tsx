import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AdminLayout } from './components/admin/AdminLayout'
import { RequireAdmin, RequireAuth } from './components/auth/guards'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Vehicles } from './pages/Vehicles'
import { VehicleDetail } from './pages/VehicleDetail'
import { MyBookings } from './pages/MyBookings'
import { Styleguide } from './pages/Styleguide'
import { AdminDashboard } from './pages/admin/Dashboard'
import { ManageVehicles } from './pages/admin/ManageVehicles'
import { ManageBookings } from './pages/admin/ManageBookings'
import { ManageUsers } from './pages/admin/ManageUsers'
import { AdminSettings } from './pages/admin/Settings'
import { ToastViewport } from './components/ui'
import { useAuthStore } from './store/auth'

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
          <Route path="/styleguide" element={<Styleguide />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="vehicles" element={<ManageVehicles />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      <ToastViewport />
    </BrowserRouter>
  )
}
