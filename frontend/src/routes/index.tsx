import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Hero } from '@/components/Hero'
import { Categories } from '@/components/Categories'
import { FeaturedEvents } from '@/components/FeaturedEvents'
import { CTA } from '@/components/CTA'
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
          <Route path="my-orders" element={<MyOrdersPage />} />
          <Route path="my-tickets" element={<MyTicketsPage />} />

          {/* Organizer routes */}
          <Route path="organizer">
            <Route path="events" element={<MyEventsPage />} />
            <Route path="sales" element={<EventSalesPage />} />
          </Route>

          {/* Admin routes */}
          <Route path="admin">
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="venues" element={<VenuesPage />} />
          </Route>

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
