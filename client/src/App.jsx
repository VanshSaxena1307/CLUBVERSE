import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom'

function RoutePlaceholder({ title, description }) {
  const params = useParams()

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl border border-emerald-100 shadow-sm text-center">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wide text-emerald-800 bg-emerald-50 rounded-full border border-emerald-200">
          CLUBVERSE — Phase 1 Route Foundation
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>
        <p className="text-slate-600 text-sm mb-4">{description}</p>

        {params.id && (
          <div className="mb-4 p-2 text-xs font-mono text-slate-600 bg-slate-100 rounded border border-slate-200">
            Route Parameter [id]: {params.id}
          </div>
        )}

        <nav aria-label="Placeholder navigation" className="pt-4 mt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Quick Route Navigation
          </p>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm">
            <Link to="/" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <Link to="/events" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
              Events
            </Link>
            <span className="text-slate-300">/</span>
            <Link to="/events/demo-event-1" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
              Event Detail
            </Link>
            <span className="text-slate-300">/</span>
            <Link to="/events/demo-event-1/register" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
              Register
            </Link>
            <span className="text-slate-300">/</span>
            <Link to="/admin/login" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
              Admin Login
            </Link>
            <span className="text-slate-300">/</span>
            <Link to="/admin" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
              Admin
            </Link>
            <span className="text-slate-300">/</span>
            <Link to="/admin/events" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
              Admin Events
            </Link>
            <span className="text-slate-300">/</span>
            <Link to="/admin/events/new" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
              New Event
            </Link>
            <span className="text-slate-300">/</span>
            <Link to="/admin/events/demo-event-1/edit" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
              Edit Event
            </Link>
            <span className="text-slate-300">/</span>
            <Link to="/admin/registrations" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
              Registrations
            </Link>
          </div>
        </nav>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RoutePlaceholder
              title="Home Page"
              description="Landing page introducing the college club, mission statement, and featured events preview."
            />
          }
        />
        <Route
          path="/events"
          element={
            <RoutePlaceholder
              title="Events Catalog"
              description="Searchable, filterable catalog of upcoming and past club events."
            />
          }
        />
        <Route
          path="/events/:id"
          element={
            <RoutePlaceholder
              title="Event Details"
              description="Dedicated event information view with schedule, venue, and registration CTA."
            />
          }
        />
        <Route
          path="/events/:id/register"
          element={
            <RoutePlaceholder
              title="Event Registration"
              description="Lightweight event registration form capturing participant details."
            />
          }
        />
        <Route
          path="/admin/login"
          element={
            <RoutePlaceholder
              title="Admin Login"
              description="Authentication screen for club administrators."
            />
          }
        />
        <Route
          path="/admin"
          element={
            <RoutePlaceholder
              title="Admin Dashboard"
              description="Overview dashboard showing key club metrics and quick actions."
            />
          }
        />
        <Route
          path="/admin/events"
          element={
            <RoutePlaceholder
              title="Admin Events Management"
              description="Management table for club events with create, edit, and delete options."
            />
          }
        />
        <Route
          path="/admin/events/new"
          element={
            <RoutePlaceholder
              title="Create New Event"
              description="Event creation form for administrators."
            />
          }
        />
        <Route
          path="/admin/events/:id/edit"
          element={
            <RoutePlaceholder
              title="Edit Event"
              description="Event modification form prefilled with event details."
            />
          }
        />
        <Route
          path="/admin/registrations"
          element={
            <RoutePlaceholder
              title="Admin Registrations"
              description="Attendee directory with search, filter, and registration count summaries."
            />
          }
        />
        <Route
          path="*"
          element={
            <RoutePlaceholder
              title="Page Not Found"
              description="The requested page route could not be found."
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
