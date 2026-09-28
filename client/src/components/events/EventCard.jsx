import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react'

// Category badge color helpers
const CATEGORY_STYLES = {
  Hackathon: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Workshop: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Coding Contest': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Cultural: 'bg-amber-50 text-amber-700 border-amber-200',
  default: 'bg-slate-50 text-slate-700 border-slate-200',
}

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

export default function EventCard({ event }) {
  const categoryStyle = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.default
  const defaultImage =
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col hover:border-emerald-300 hover:shadow-md transition-all duration-200">
      {/* Event Image Banner */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img
          src={event.image_url || defaultImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${categoryStyle} backdrop-blur-xs`}
          >
            {event.category}
          </span>
        </div>
        {event.is_featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2 py-0.5 text-[11px] font-bold text-white bg-emerald-600 rounded-full shadow-xs">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Event Details Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 mb-2">
          {event.title}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
          {event.description}
        </p>

        {/* Metadata items */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Link
            to={`/events/${event.id}`}
            className="flex-1 text-center py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Details
          </Link>
          <Link
            to={`/events/${event.id}/register`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
          >
            <span>Register</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  )
}
