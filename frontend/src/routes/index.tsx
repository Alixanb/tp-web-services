import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Hero } from '@/components/Hero'
import { Categories } from '@/components/Categories'
import { FeaturedEvents } from '@/components/FeaturedEvents'
import { CTA } from '@/components/CTA'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { EventsPage } from '@/pages/EventsPage'
import { EventDetailPage } from '@/pages/EventDetailPage'
import { TicketReservationPage } from '@/pages/TicketReservationPage'
import { MyOrdersPage } from '@/pages/MyOrdersPage'
import { MyTicketsPage } from '@/pages/MyTicketsPage'
import { LoginPage } from '@/pages/LoginPage'
import { MyEventsPage } from '@/pages/organizer/MyEventsPage'
import { CreateEventPage } from '@/pages/organizer/CreateEventPage'
import { EventSalesPage } from '@/pages/organizer/EventSalesPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'

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
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route
            path="reserve/:ticketCategoryId"
            element={
              <ProtectedRoute allowedRoles={['CLIENT', 'ORGANIZER', 'ADMIN']}>
                <TicketReservationPage />
              </ProtectedRoute>
            }
          />

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
              path="events/new"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
                  <CreateEventPage />
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
          </Route>

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
