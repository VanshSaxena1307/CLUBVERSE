import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Printer,
  ArrowLeft,
  Compass,
  User,
  Mail,
  GraduationCap,
  Phone,
  Building2,
} from 'lucide-react'
import { registrationService } from '../../services/registrationService.js'
import LoadingState from '../../components/common/LoadingState.jsx'
import ErrorState from '../../components/common/ErrorState.jsx'

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function EventTicketPage() {
  const { registrationId } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    registrationService
      .getTicketById(registrationId)
      .then((data) => {
        if (isMounted) {
          if (!data) {
            setError('Registration ticket not found. Please verify your ticket ID or lookup your registration by email.')
          } else {
            setTicket(data)
          }
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Unable to retrieve ticket details. Please try again.')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [registrationId])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return <LoadingState message="Generating your event ticket..." />
  }

  if (error || !ticket) {
    return (
      <div className="py-12 max-w-xl mx-auto space-y-6">
        <ErrorState
          title="Ticket Not Found"
          message={error || 'We could not locate an event registration matching this ID.'}
        />
        <div className="flex flex-col sm:flex-row gap-3 justify-center text-center">
          <Link
            to="/my-registrations"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Ticket className="w-4 h-4" />
            <span>Find My Registrations</span>
          </Link>
          <Link
            to="/events"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </Link>
        </div>
      </div>
    )
  }

  const event = ticket.event || {}

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 space-y-6 pb-20">
      {/* Top Nav Action (Hidden during print) */}
      <div className="print:hidden flex items-center justify-between gap-4">
        <Link
          to={ticket.email ? `/my-registrations?email=${encodeURIComponent(ticket.email)}` : '/my-registrations'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Registrations</span>
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Ticket</span>
        </button>
      </div>

      {/* Main Digital Ticket Container */}
      <div className="bg-white rounded-3xl border border-emerald-200/90 shadow-md overflow-hidden relative print:shadow-none print:border-slate-300">
        {/* Ticket Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white border border-white/20">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold tracking-tight text-lg text-white block leading-tight">
                  CLUBVERSE
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-200 block">
                  Campus Club Event Management
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 backdrop-blur-xs border border-white/20 text-xs font-semibold text-emerald-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>REGISTERED / CONFIRMED</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 mb-2">
              {event.category || 'Campus Event'}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {event.title || 'Event Entry Ticket'}
            </h1>
          </div>
        </div>

        {/* Event Schedule & Location Bar */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Date</span>
              <span className="font-semibold text-slate-900">{formatDate(event.date)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Time</span>
              <span className="font-semibold text-slate-900">{event.time || 'TBA'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Venue</span>
              <span className="font-semibold text-slate-900 truncate block">{event.venue || 'Campus'}</span>
            </div>
          </div>
        </div>

        {/* Decorative Perforation Divider */}
        <div className="relative py-2 bg-white flex items-center">
          {/* Left Notch */}
          <div className="absolute -left-3.5 w-7 h-7 rounded-full bg-slate-50 border-r border-emerald-200" />
          {/* Dashed line */}
          <div className="w-full border-t-2 border-dashed border-slate-200 mx-5" />
          {/* Right Notch */}
          <div className="absolute -right-3.5 w-7 h-7 rounded-full bg-slate-50 border-l border-emerald-200" />
        </div>

        {/* Attendee Details Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Attendee Information
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  Student Name
                </span>
                <span className="text-sm font-bold text-slate-900 block">{ticket.name}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  Email Address
                </span>
                <span className="text-sm font-semibold text-slate-800 break-all block">{ticket.email}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  College / Department
                </span>
                <span className="text-sm font-semibold text-slate-800 block">{ticket.college}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  Year of Study
                </span>
                <span className="text-sm font-semibold text-slate-800 block">{ticket.year}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  Contact Phone
                </span>
                <span className="text-sm font-semibold text-slate-800 block">{ticket.phone}</span>
              </div>
            </div>
          </div>

          {/* Ticket Security & Identifier Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Official Registration ID
              </span>
              <code className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 select-all inline-block">
                {ticket.id}
              </code>
            </div>

            <div className="text-left sm:text-right text-[11px] text-slate-400 space-y-0.5">
              <span className="font-semibold text-emerald-700 block">Verified Campus Entry</span>
              <span>Present this ticket on your device or printed copy at entry.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer (Print-hidden) */}
      <div className="print:hidden flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Link
          to={ticket.email ? `/my-registrations?email=${encodeURIComponent(ticket.email)}` : '/my-registrations'}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Registrations</span>
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Ticket</span>
        </button>
      </div>
    </div>
  )
}
