import { useState, useEffect, useMemo } from 'react'
import { eventService } from '../../services/eventService.js'
import EventCard from '../../components/events/EventCard.jsx'
import EventFilterBar from '../../components/events/EventFilterBar.jsx'
import LoadingState from '../../components/common/LoadingState.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import ErrorState from '../../components/common/ErrorState.jsx'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

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
        setError(err.message || 'Unable to retrieve club events')
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
          setError(err.message || 'Unable to retrieve club events')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Fast client-side filtering via useMemo (per architecture.md Section 14.1)
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Category filter
      const matchesCategory =
        category === 'All' || event.category?.toLowerCase() === category.toLowerCase()

      // Search filter (title and description)
      const term = search.trim().toLowerCase()
      const matchesSearch =
        !term ||
        event.title?.toLowerCase().includes(term) ||
        event.description?.toLowerCase().includes(term) ||
        event.venue?.toLowerCase().includes(term)

      return matchesCategory && matchesSearch
    })
  }, [events, category, search])

  const clearFilters = () => {
    setSearch('')
    setCategory('All')
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="border-b border-emerald-100 pb-6 pt-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Club Events Catalog
        </h1>
        <p className="text-sm text-slate-600">
          Explore upcoming campus workshops, hackathons, and activities. Click any event to learn more or register instantly.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <EventFilterBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        totalCount={filteredEvents.length}
      />

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Fetching events from server..." />
      ) : error ? (
        <ErrorState message={error} onRetry={reloadEvents} />
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          title="No events match your criteria"
          message={
            search || category !== 'All'
              ? 'Try adjusting your search terms or clearing your category filters to view other club activities.'
              : 'There are currently no events scheduled. Please check back later.'
          }
          actionLabel={search || category !== 'All' ? 'Clear All Filters' : undefined}
          onAction={clearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
