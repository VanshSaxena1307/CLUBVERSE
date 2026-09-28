import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import AdminLayout from './components/layout/AdminLayout.jsx'

// Public Pages
import HomePage from './pages/public/HomePage.jsx'
import EventsPage from './pages/public/EventsPage.jsx'
import EventDetailPage from './pages/public/EventDetailPage.jsx'
import EventRegisterPage from './pages/public/EventRegisterPage.jsx'
import MyRegistrationsPage from './pages/public/MyRegistrationsPage.jsx'
import EventTicketPage from './pages/public/EventTicketPage.jsx'

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import AdminEventsPage from './pages/admin/AdminEventsPage.jsx'
import AdminEventFormPage from './pages/admin/AdminEventFormPage.jsx'
import AdminRegistrationsPage from './pages/admin/AdminRegistrationsPage.jsx'

function PublicLayoutWrapper({ children }) {
  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin')

  // If path is an admin page, do not render public Navbar/Footer
  if (isAdminPath) {
    return children
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PublicLayoutWrapper>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/events/:id/register" element={<EventRegisterPage />} />
            <Route path="/my-registrations" element={<MyRegistrationsPage />} />
            <Route path="/my-registrations/:registrationId/ticket" element={<EventTicketPage />} />

            {/* Admin Login (Public Gateway for Organizers) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminDashboardPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminEventsPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events/new"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminEventFormPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events/:id/edit"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminEventFormPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registrations"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminRegistrationsPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="py-20 text-center">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">404 — Page Not Found</h1>
                  <p className="text-sm text-slate-500 mb-6">
                    The page you are looking for does not exist or has been moved.
                  </p>
                  <Link
                    to="/"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
                  >
                    Return to Home
                  </Link>
                </div>
              }
            />
          </Routes>
        </PublicLayoutWrapper>
      </BrowserRouter>
    </AuthProvider>
  )
}
