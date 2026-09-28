import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  Users,
  ExternalLink,
  LogOut,
  Shield,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/useAuth.js'

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const navLinks = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Events', path: '/admin/events', icon: Calendar },
    { label: 'New Event', path: '/admin/events/new', icon: CalendarPlus },
    { label: 'Registrations', path: '/admin/registrations', icon: Users },
  ]

  const isActive = (link) => {
    if (link.exact) return location.pathname === link.path
    return location.pathname.startsWith(link.path)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-emerald-100 sticky top-0 z-30">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">CLUBVERSE</span>
            <span className="text-[10px] text-emerald-600 block font-semibold uppercase">Admin Console</span>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-emerald-100 px-4 py-3 space-y-1">
          <div className="text-xs text-slate-400 font-medium px-2 py-1 mb-1">
            Logged in: <span className="font-semibold text-slate-700">{admin?.email}</span>
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link)
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium ${
                  active ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-600" />
                {link.label}
              </Link>
            )
          })}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 py-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Public Site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 py-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-emerald-100 p-5 shrink-0 min-h-screen sticky top-0 h-screen">
        {/* Logo */}
        <div className="pb-6 mb-4 border-b border-slate-100">
          <Link to="/admin" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight block">
                CLUBVERSE
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link)
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-100/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Signed in as</div>
            <div className="text-xs font-semibold text-slate-800 truncate" title={admin?.email}>
              {admin?.email || 'admin@clubverse.edu'}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
