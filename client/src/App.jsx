import { BrowserRouter, Routes, Route, Link, useParams, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import HomePage from './pages/public/HomePage.jsx'
import EventsPage from './pages/public/EventsPage.jsx'
import EventDetailPage from './pages/public/EventDetailPage.jsx'
import EventRegisterPage from './pages/public/EventRegisterPage.jsx'

/**
 * Clean placeholder component for Admin routes (Scheduled for Phase 3)
 */
function AdminRoutePlaceholder({ title, description }) {
  const params = useParams()

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/50">
      <div className="w-full max-w-lg p-8 bg-white rounded-3xl border border-emerald-100 shadow-sm text-center">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wide text-emerald-800 bg-emerald-50 rounded-full border border-emerald-200">
          Admin Back-Office — Phase 3
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>
        <p className="text-slate-600 text-sm mb-4 leading-relaxed">{description}</p>

        {params.id && (
          <div className="mb-4 p-2 text-xs font-mono text-slate-600 bg-slate-50 rounded border border-slate-200">
            Route Parameter [id]: {params.id}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-center gap-3 text-xs">
          <Link to="/" className="text-emerald-700 font-medium hover:underline">
            Home
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/events" className="text-emerald-700 font-medium hover:underline">
            Events
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/admin/login" className="text-emerald-700 font-medium hover:underline">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  )
}

function LayoutWrapper({ children }) {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className={isAdminRoute ? 'flex-1 flex flex-col' : 'flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8'}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/events/:id/register" element={<EventRegisterPage />} />

          {/* Admin Routes (Placeholders reserved for Phase 3) */}
          <Route
            path="/admin/login"
            element={
              <AdminRoutePlaceholder
                title="Admin Login"
                description="Secure authentication gateway for campus club executives and organizers."
              />
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoutePlaceholder
                title="Admin Dashboard"
                description="Executive overview showing active events, attendee metrics, and quick shortcuts."
              />
            }
          />
          <Route
            path="/admin/events"
            element={
              <AdminRoutePlaceholder
                title="Admin Events Management"
                description="Management directory to create, edit, toggle featured status, and delete club events."
              />
            }
          />
          <Route
            path="/admin/events/new"
            element={
              <AdminRoutePlaceholder
                title="Create New Event"
                description="Form to publish new campus club activities with category, schedule, and venue details."
              />
            }
          />
          <Route
            path="/admin/events/:id/edit"
            element={
              <AdminRoutePlaceholder
                title="Edit Event"
                description="Form to modify existing club event schedules, venue info, and descriptions."
              />
            }
          />
          <Route
            path="/admin/registrations"
            element={
              <AdminRoutePlaceholder
                title="Admin Registrations Directory"
                description="Comprehensive attendee directory with event filtering, live search, and export capabilities."
              />
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
      </LayoutWrapper>
    </BrowserRouter>
  )
}
