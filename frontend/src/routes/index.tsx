import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Hero } from '@/components/Hero'
import { Categories } from '@/components/Categories'
import { FeaturedEvents } from '@/components/FeaturedEvents'
import { CTA } from '@/components/CTA'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { EventsPage } from '@/pages/EventsPage'
import { MyOrdersPage } from '@/pages/MyOrdersPage'
import { MyTicketsPage } from '@/pages/MyTicketsPage'
import { LoginPage } from '@/pages/LoginPage'
import { MyEventsPage } from '@/pages/organizer/MyEventsPage'
import { EventSalesPage } from '@/pages/organizer/EventSalesPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { VenuesPage } from '@/pages/admin/VenuesPage'

// Page d'accueil
function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedEvents />
      <CTA />
    </>
  )
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<LoginPage />} />

        {/* Routes avec layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventsPage />} />

          {/* Client routes */}
          <Route
            path="my-orders"
            element={
              <ProtectedRoute allowedRoles={['CLIENT', 'ORGANIZER', 'ADMIN']}>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-tickets"
            element={
              <ProtectedRoute allowedRoles={['CLIENT', 'ORGANIZER', 'ADMIN']}>
                <MyTicketsPage />
              </ProtectedRoute>
            }
          />

          {/* Organizer routes */}
          <Route path="organizer">
            <Route
              path="events"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
                  <MyEventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="sales"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
                  <EventSalesPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin routes */}
          <Route path="admin">
            <Route
              path="dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="venues"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <VenuesPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
