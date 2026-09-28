import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Share2,
  CheckCircle2,
} from 'lucide-react'
import { eventService } from '../../services/eventService.js'
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

export default function EventDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const reloadEvent = () => {
    setLoading(true)
    setError(null)
    eventService
      .getEventById(id)
      .then((data) => {
        setEvent(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Unable to find the requested event')
        setLoading(false)
      })
  }

  useEffect(() => {
    let isMounted = true
    eventService
      .getEventById(id)
      .then((data) => {
        if (isMounted) {
          setEvent(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Unable to find the requested event')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [id])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <LoadingState message="Loading event details..." />
  }

  if (error || !event) {
    return (
      <div className="py-12">
        <ErrorState
          title="Event Not Found"
          message={error || 'This event does not exist or may have been removed.'}
          onRetry={reloadEvent}
        />
        <div className="text-center mt-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events Catalog</span>
          </Link>
        </div>
      </div>
    )
  }

  const defaultImage =
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'

  return (
    <div className="space-y-8 pb-16">
      {/* Top Back Navigation */}
      <div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {/* Main Grid: Detail Content & Registration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Banner & Detailed Info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Banner Image */}
          <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs">
            <img
              src={event.image_url || defaultImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50/95 backdrop-blur-xs border border-emerald-200 shadow-2xs">
                {event.category}
              </span>
              {event.is_featured && (
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-emerald-600 shadow-2xs">
                  Featured Event
                </span>
              )}
            </div>
          </div>

          {/* Title & Description Card */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-emerald-100 shadow-2xs space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {event.title}
              </h1>
            </div>

            <div>
              <h2 className="text-xs uppercase font-bold tracking-wider text-emerald-700 mb-2">
                About this Event
              </h2>
              <div className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>

            {/* Quick Share action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Event</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Campus Club Event</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Event Logistics & Register Box */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="p-6 bg-white rounded-3xl border border-emerald-200 shadow-xs space-y-6">
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1">
                Event Logistics
              </div>
              <h3 className="text-lg font-bold text-slate-900">Schedule &amp; Location</h3>
            </div>

            {/* Metadata list */}
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Date</div>
                  <div className="font-semibold text-slate-800">{formatDate(event.date)}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Time</div>
                  <div className="font-semibold text-slate-800">{event.time}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Venue</div>
                  <div className="font-semibold text-slate-800 leading-snug">{event.venue}</div>
                </div>
              </div>
            </div>

            {/* Register CTA Button */}
            <div className="pt-4 border-t border-slate-100">
              <Link
                to={`/events/${event.id}/register`}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>Register for Event</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Free registration • Instant confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
