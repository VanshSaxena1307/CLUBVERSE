import { useState, useEffect, useMemo } from 'react'
import {
  Search,
  X,
  Calendar,
  Mail,
  Phone,
  GraduationCap,
  Building,
  RefreshCw,
} from 'lucide-react'
import { adminService } from '../../services/adminService.js'
import { eventService } from '../../services/eventService.js'
import LoadingState from '../../components/common/LoadingState.jsx'
import ErrorState from '../../components/common/ErrorState.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [search, setSearch] = useState('')
  const [selectedEventId, setSelectedEventId] = useState('all')

  const loadData = () => {
    setLoading(true)
    setError(null)
    Promise.all([adminService.getRegistrations(), eventService.getEvents()])
      .then(([regs, evts]) => {
        setRegistrations(regs)
        setEvents(evts)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load attendee registrations')
        setLoading(false)
      })
  }

  useEffect(() => {
    let isMounted = true
    Promise.all([adminService.getRegistrations(), eventService.getEvents()])
      .then(([regs, evts]) => {
        if (isMounted) {
          setRegistrations(regs)
          setEvents(evts)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load attendee registrations')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Fast client-side search & filtering per architecture.md Section 14.2
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      // Event filter
      const matchesEvent =
        selectedEventId === 'all' || reg.event_id === selectedEventId

      // Search filter (student name or email or college)
      const term = search.trim().toLowerCase()
      const matchesSearch =
        !term ||
        reg.name?.toLowerCase().includes(term) ||
        reg.email?.toLowerCase().includes(term) ||
        reg.college?.toLowerCase().includes(term)

      return matchesEvent && matchesSearch
    })
  }, [registrations, selectedEventId, search])

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Attendee Registrations Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time student RSVP submissions across all campus club events.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, email, or department..."
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 placeholder:text-slate-400 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Event Dropdown Filter */}
          <div className="w-full md:w-72">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-all"
            >
              <option value="all">All Events ({registrations.length})</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div>
            Showing <strong className="text-emerald-700 font-semibold">{filteredRegistrations.length}</strong> of {registrations.length} attendee{registrations.length === 1 ? '' : 's'}
          </div>
          {(search || selectedEventId !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setSelectedEventId('all')
              }}
              className="text-xs text-emerald-600 hover:text-emerald-700 underline font-medium cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Fetching attendee records from database..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : filteredRegistrations.length === 0 ? (
        <EmptyState
          title="No registrations match your search"
          message={
            search || selectedEventId !== 'all'
              ? 'Try clearing your search keyword or selecting a different event.'
              : 'No students have signed up for club events yet.'
          }
          actionLabel={search || selectedEventId !== 'all' ? 'Reset Filters' : undefined}
          onAction={() => {
            setSearch('')
            setSelectedEventId('all')
          }}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">College / Year</th>
                  <th className="py-3.5 px-4">Event</th>
                  <th className="py-3.5 px-4 text-right">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{reg.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ID: {reg.id.slice(0, 8)}...
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700">{reg.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Phone className="w-3 h-3 shrink-0" />
                        <span>{reg.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{reg.college}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <GraduationCap className="w-3 h-3 shrink-0" />
                        <span>{reg.year}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="max-w-[200px] truncate">
                          {reg.events?.title || 'Club Event'}
                        </span>
                      </div>
                      {reg.events?.category && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100">
                          {reg.events.category}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-500 whitespace-nowrap">
                      {formatDate(reg.registered_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
