import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  CalendarCheck,
  Users,
  CalendarPlus,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { eventService } from '../../services/eventService.js'
import { adminService } from '../../services/adminService.js'
import LoadingState from '../../components/common/LoadingState.jsx'
import ErrorState from '../../components/common/ErrorState.jsx'

export default function AdminDashboardPage() {
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadDashboardData = () => {
    setLoading(true)
    setError(null)
    Promise.all([eventService.getEvents(), adminService.getRegistrations()])
      .then(([eventsData, registrationsData]) => {
        setEvents(eventsData)
        setRegistrations(registrationsData)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load dashboard metrics')
        setLoading(false)
      })
  }

  useEffect(() => {
    let isMounted = true
    Promise.all([eventService.getEvents(), adminService.getRegistrations()])
      .then(([eventsData, registrationsData]) => {
        if (isMounted) {
          setEvents(eventsData)
          setRegistrations(registrationsData)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load dashboard metrics')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <LoadingState message="Loading club administration metrics..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboardData} />
  }

  // Calculate real metrics without fake data
  const totalEvents = events.length
  const todayStr = new Date().toISOString().split('T')[0]
  const upcomingEvents = events.filter((e) => e.date >= todayStr).length
  const totalRegistrations = registrations.length

  const recentRegistrations = registrations.slice(0, 5)

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title & Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Executive Back-Office</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Club Overview &amp; Metrics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time status of campus events, registrations, and club activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/events/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Create Event</span>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Events */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Events
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalEvents}</div>
          <p className="text-xs text-slate-500 mt-1">Managed activities in registry</p>
        </div>

        {/* Upcoming Events */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Upcoming Events
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-teal-700">{upcomingEvents}</div>
          <p className="text-xs text-slate-500 mt-1">Scheduled on or after today</p>
        </div>

        {/* Total Registrations */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total RSVPs
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-indigo-700">{totalRegistrations}</div>
          <p className="text-xs text-slate-500 mt-1">Verified student registrations</p>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-emerald-100 shadow-2xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Quick Shortcuts</h2>
          <p className="text-xs text-slate-500">Fast paths for routine administrative tasks</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <Link
            to="/admin/events"
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-200 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-emerald-600 border border-slate-100 shadow-2xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                  Manage Events
                </div>
                <div className="text-[11px] text-slate-500">Edit or delete offerings</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            to="/admin/registrations"
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-200 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-emerald-600 border border-slate-100 shadow-2xs">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                  View Registrations
                </div>
                <div className="text-[11px] text-slate-500">Review student attendees</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            to="/admin/events/new"
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-200 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-emerald-600 border border-slate-100 shadow-2xs">
                <CalendarPlus className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                  Add New Event
                </div>
                <div className="text-[11px] text-slate-500">Publish to public catalog</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Recent Registrations Table Snapshot */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Registrations</h2>
            <p className="text-xs text-slate-500">Latest student RSVPs received</p>
          </div>
          <Link
            to="/admin/registrations"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All ({totalRegistrations})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentRegistrations.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No student registrations recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Event</th>
                  <th className="py-2.5 px-3">College</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{reg.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{reg.email}</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-medium">
                      {reg.events?.title || 'Event'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{reg.college}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
