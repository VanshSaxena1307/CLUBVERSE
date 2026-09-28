import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { eventService } from '../../services/eventService.js'
import { registrationService } from '../../services/registrationService.js'
import LoadingState from '../../components/common/LoadingState.jsx'
import ErrorState from '../../components/common/ErrorState.jsx'

const YEAR_OPTIONS = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Junior)',
  '4th Year (Senior)',
  'Postgraduate / Masters',
  'PhD / Research Scholar',
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function EventRegisterPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loadingEvent, setLoadingEvent] = useState(true)
  const [eventError, setEventError] = useState(null)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    year: YEAR_OPTIONS[0],
    phone: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [successResult, setSuccessResult] = useState(null)

  useEffect(() => {
    let isMounted = true
    eventService
      .getEventById(id)
      .then((data) => {
        if (isMounted) {
          setEvent(data)
          setLoadingEvent(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setEventError(err.message || 'Event not found')
          setLoadingEvent(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formError) setFormError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    // Quick client-side sanity check
    if (!formData.name.trim() || !formData.email.trim() || !formData.college.trim() || !formData.phone.trim()) {
      setFormError('Please fill out all required fields.')
      return
    }

    try {
      setSubmitting(true)
      setFormError(null)

      const payload = {
        event_id: id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        college: formData.college.trim(),
        year: formData.year,
        phone: formData.phone.trim(),
      }

      const response = await registrationService.registerForEvent(payload)
      // Save email for quick lookup on My Registrations
      try {
        localStorage.setItem('clubverse_student_email', formData.email.trim())
      } catch {
        // Ignore localStorage restrictions
      }
      setSuccessResult(response)
    } catch (err) {
      setFormError(err.message || 'Failed to submit registration. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingEvent) {
    return <LoadingState message="Loading event information..." />
  }

  if (eventError || !event) {
    return (
      <div className="py-12">
        <ErrorState
          title="Event Not Found"
          message="Cannot register because this event does not exist or has been removed."
        />
        <div className="text-center mt-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Events Catalog</span>
          </Link>
        </div>
      </div>
    )
  }

  // Success Confirmation Screen
  if (successResult) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-md p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 mb-3">
            Registration Confirmed
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Registration Successful!
          </h1>

          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Your RSVP has been confirmed for{' '}
            <strong className="text-slate-800">{event.title}</strong>. A digital ticket has been generated for your entry.
          </p>

          {/* Registration Details Summary Card */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-left text-xs space-y-2.5 mb-8">
            <div className="flex justify-between border-b border-emerald-100/60 pb-2">
              <span className="text-slate-400 font-medium">Event Name</span>
              <span className="font-semibold text-slate-800 text-right">{event.title}</span>
            </div>
            <div className="flex justify-between border-b border-emerald-100/60 pb-2">
              <span className="text-slate-400 font-medium">Student Name</span>
              <span className="font-semibold text-slate-800">{formData.name}</span>
            </div>
            <div className="flex justify-between border-b border-emerald-100/60 pb-2">
              <span className="text-slate-400 font-medium">Registration ID</span>
              <span className="font-mono font-semibold text-emerald-800">{successResult.registrationId}</span>
            </div>
            <div className="flex justify-between border-b border-emerald-100/60 pb-2">
              <span className="text-slate-400 font-medium">Email Address</span>
              <span className="font-semibold text-slate-800">{formData.email}</span>
            </div>
            <div className="flex justify-between border-b border-emerald-100/60 pb-2">
              <span className="text-slate-400 font-medium">Date &amp; Time</span>
              <span className="font-semibold text-slate-800">{formatDate(event.date)} at {event.time}</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-slate-400 font-medium">Venue</span>
              <span className="font-semibold text-slate-800">{event.venue}</span>
            </div>
          </div>

          {/* Action Buttons as requested */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/my-registrations/${successResult.registrationId}/ticket`}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>View My Ticket</span>
            </Link>
            <Link
              to={`/my-registrations?email=${encodeURIComponent(formData.email.trim())}`}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View My Registrations</span>
            </Link>
            <Link
              to="/events"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 bg-transparent hover:bg-slate-100 transition-colors flex items-center justify-center"
            >
              <span>Back to Events</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Registration Form Screen
  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-8 space-y-6 pb-16">
      {/* Back button */}
      <div>
        <Link
          to={`/events/${event.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Details</span>
        </Link>
      </div>

      {/* Event summary banner header */}
      <div className="p-6 bg-white rounded-3xl border border-emerald-100 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200">
            {event.category}
          </span>
          <span className="text-xs text-slate-400">• Free Campus Activity</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">{event.title}</h1>
        <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{event.venue}</span>
          </div>
        </div>
      </div>

      {/* Main Registration Form Card */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Student Sign-Up</h2>
          </div>
          <p className="text-xs text-slate-500">
            Fill in your contact details below. No account or password required.
          </p>
        </div>

        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{formError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Rivera"
              disabled={submitting}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Student / Contact Email <span className="text-rose-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. alex.rivera@campus.edu"
              disabled={submitting}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* College and Year grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="college" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                College / Department <span className="text-rose-500">*</span>
              </label>
              <input
                id="college"
                name="college"
                type="text"
                required
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                disabled={submitting}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </div>

            <div>
              <label htmlFor="year" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Year of Study <span className="text-rose-500">*</span>
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 transition-all"
              >
                {YEAR_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contact Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 555-0199"
              disabled={submitting}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 rounded-xl transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting RSVP...</span>
                </>
              ) : (
                <span>Confirm Event Registration</span>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              By registering, you agree to receive event updates from the club organizing committee.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
