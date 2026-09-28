import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Compass, Users, Award, ArrowRight, Sparkles } from 'lucide-react'
import { eventService } from '../../services/eventService.js'
import FeaturedEventCard from '../../components/events/FeaturedEventCard.jsx'
import EventCard from '../../components/events/EventCard.jsx'
import LoadingState from '../../components/common/LoadingState.jsx'
import ErrorState from '../../components/common/ErrorState.jsx'

export default function HomePage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reloadEvents = () => {
    setLoading(true)
    setError(null)
    eventService
      .getEvents()
      .then((data) => {
        setEvents(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load club events')
        setLoading(false)
      })
  }

  useEffect(() => {
    let isMounted = true
    eventService
      .getEvents()
      .then((data) => {
        if (isMounted) {
          setEvents(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load club events')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const featuredEvent = events.find((e) => e.is_featured) || events[0]
  const upcomingEvents = events.filter((e) => e.id !== featuredEvent?.id).slice(0, 3)

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 text-center">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Official Campus Student Club Portal</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight sm:leading-tight mb-5">
          Discover, Connect &amp; Lead in{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
            Campus Club Life
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Welcome to <strong className="text-slate-800 font-semibold">CLUBVERSE</strong> — your central
          gateway to hands-on workshops, hackathons, coding contests, and cultural showcases. No login walls:
          explore offerings and register in seconds.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/events"
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>Explore All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#featured-section"
            className="px-6 py-3 text-sm font-semibold text-slate-700 hover:text-emerald-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            View Spotlight
          </a>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-12 pt-8 border-t border-slate-200/70">
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">500+</div>
            <div className="text-xs text-slate-500 font-medium">Club Members</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">20+</div>
            <div className="text-xs text-slate-500 font-medium">Annual Events</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-700">100%</div>
            <div className="text-xs text-slate-500 font-medium">Free Access</div>
          </div>
        </div>
      </section>

      {/* Featured Spotlight Section */}
      <section id="featured-section" className="scroll-mt-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1">
              Spotlight Initiative
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Event</h2>
          </div>
        </div>

        {loading ? (
          <LoadingState message="Loading spotlight event..." />
        ) : error ? (
          <ErrorState message={error} onRetry={reloadEvents} />
        ) : featuredEvent ? (
          <FeaturedEventCard event={featuredEvent} />
        ) : null}
      </section>

      {/* Upcoming Events Preview */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1">
              Get Involved
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Upcoming Events</h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Loading upcoming events..." />
        ) : error ? (
          <ErrorState message={error} onRetry={reloadEvents} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Club Pillars / Value Proposition */}
      <section className="p-8 sm:p-10 bg-white rounded-3xl border border-emerald-100 shadow-2xs">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1">
            Why Participate
          </div>
          <h2 className="text-2xl font-bold text-slate-900">The Student Advantage</h2>
          <p className="text-sm text-slate-600 mt-2">
            Every event is designed to broaden your horizons and enhance your student portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Skill Building</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hands-on workshops led by experienced student mentors and industry guests to accelerate your technical skills.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Hackathons &amp; Contests</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Put your knowledge to the test in competitive arenas with certificates, peer recognition, and exciting prizes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Campus Community</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Forge lasting friendships, collaborate on multidisciplinary teams, and participate in lively cultural festivals.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
