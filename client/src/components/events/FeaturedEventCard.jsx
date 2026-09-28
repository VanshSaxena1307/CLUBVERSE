import { Link } from 'react-router-dom'
import { Sparkles, Calendar, Clock, MapPin, ArrowRight } from 'lucide-react'

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

export default function FeaturedEventCard({ event }) {
  if (!event) return null

  const defaultImage =
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'

  return (
    <div className="relative overflow-hidden bg-white rounded-3xl border border-emerald-200/90 shadow-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Banner image */}
        <div className="relative lg:col-span-6 h-64 lg:h-auto min-h-[260px] bg-slate-100 overflow-hidden">
          <img
            src={event.image_url || defaultImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50/95 backdrop-blur-xs border border-emerald-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Featured Spotlight
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 bg-white/95 backdrop-blur-xs border border-slate-200 shadow-xs">
              {event.category}
            </span>
          </div>
        </div>

        {/* Content column */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 leading-snug">
              {event.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
              {event.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/70 mb-6 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-2xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Date</div>
                  <div className="font-medium text-slate-800">{formatDate(event.date)}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Time</div>
                  <div className="font-medium text-slate-800">{event.time}</div>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-center gap-2.5 pt-1">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-2xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Venue</div>
                  <div className="font-medium text-slate-800">{event.venue}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              to={`/events/${event.id}/register`}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
            >
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={`/events/${event.id}`}
              className="w-full sm:w-auto px-5 py-3 text-sm font-semibold text-slate-700 hover:text-emerald-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors text-center"
            >
              Event Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
