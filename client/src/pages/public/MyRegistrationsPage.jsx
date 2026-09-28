import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { registrationService } from '../../services/registrationService.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function MyRegistrationsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialEmailParam = searchParams.get('email') || ''

  const [emailInput, setEmailInput] = useState(() => {
    if (initialEmailParam) return initialEmailParam
    try {
      return localStorage.getItem('clubverse_student_email') || ''
    } catch {
      return ''
    }
  })

  const [searchedEmail, setSearchedEmail] = useState('')
  const [registrations, setRegistrations] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(initialEmailParam && EMAIL_REGEX.test(initialEmailParam.trim())))
  const [error, setError] = useState(null)

  // Auto-search if email is provided via query parameter on initial load
  useEffect(() => {
    if (!initialEmailParam || !EMAIL_REGEX.test(initialEmailParam.trim())) {
      return
    }

    let isMounted = true
    const emailToQuery = initialEmailParam.trim()

    registrationService
      .getRegistrationsByEmail(emailToQuery)
      .then((data) => {
        if (isMounted) {
          setRegistrations(data)
          setSearchedEmail(emailToQuery)
          setLoading(false)
          try {
            localStorage.setItem('clubverse_student_email', emailToQuery)
          } catch {
            // Ignore storage restrictions
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Unable to fetch your registrations. Please check your network.')
          setRegistrations([])
          setSearchedEmail(emailToQuery)
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [initialEmailParam])

  const handleSearchSubmit = async (e) => {
    e.preventDefault()
    const trimmed = emailInput.trim()

    if (!trimmed) {
      setError('Please enter your email address to look up registrations.')
      return
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      setError('Please enter a valid email address (e.g. student@campus.edu).')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSearchedEmail(trimmed)
      setSearchParams({ email: trimmed })

      const data = await registrationService.getRegistrationsByEmail(trimmed)
      setRegistrations(data)

      try {
        localStorage.setItem('clubverse_student_email', trimmed)
      } catch {
        // Ignore localStorage restrictions
      }
    } catch (err) {
      setError(err.message || 'Unable to fetch your registrations. Please check your network and try again.')
      setRegistrations([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-8 pb-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          <Ticket className="w-3.5 h-3.5 text-emerald-600" />
          <span>Student Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Registrations &amp; Event Tickets
        </h1>
        <p className="text-sm text-slate-500">
          Quickly access your confirmed RSVPs, view event details, and open your entry tickets using your email.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white rounded-3xl border border-emerald-100/90 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="student-email-lookup"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              Enter the email used during registration
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="student-email-lookup"
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value)
                    if (error) setError(null)
                  }}
                  placeholder="e.g. alex.rivera@campus.edu"
                  disabled={loading}
                  className="w-full pl-10 pr-3.5 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 transition-all shadow-2xs"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Find My Registrations</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            No password needed. We look up active event RSVPs matching your registration email address.
          </p>
        </form>

        {/* Validation / Network Error Banner */}
        {error && (
          <div className="mt-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{error}</div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-sm text-slate-600 font-medium">Looking up your event registrations...</p>
        </div>
      )}

      {!loading && registrations !== null && registrations.length === 0 && !error && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">No Registrations Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            We couldn&apos;t find any event registrations registered under{' '}
            <strong className="text-slate-700 font-mono">{searchedEmail}</strong>.
            Please ensure you entered the exact email address used when signing up.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browse Upcoming Campus Events</span>
          </Link>
        </div>
      )}

      {!loading && registrations && registrations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Found {registrations.length} {registrations.length === 1 ? 'Registration' : 'Registrations'} for{' '}
              <span className="text-slate-800 font-semibold">{searchedEmail}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registrations.map((reg) => {
              const event = reg.event || {}
              return (
                <div
                  key={reg.id}
                  className="bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-sm transition-all p-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top Row: Category and Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200">
                        {event.category || 'Club Event'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Confirmed</span>
                      </span>
                    </div>

                    {/* Event Title */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                        {event.title || 'Untitled Event'}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Registered attendee:{' '}
                        <span className="text-slate-700 font-medium">{reg.name}</span>
                      </p>
                    </div>

                    {/* Event Meta Details */}
                    <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{event.time || 'TBA'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{event.venue || 'Campus Venue'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Registration ID & View Ticket CTA */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-400">
                      ID:{' '}
                      <code className="font-mono text-[10px] text-emerald-800 font-semibold select-all bg-slate-50 px-1 py-0.5 rounded border border-slate-200">
                        {reg.id.substring(0, 8)}...
                      </code>
                    </div>

                    <Link
                      to={`/my-registrations/${reg.id}/ticket`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors group"
                    >
                      <Ticket className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View Ticket</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
