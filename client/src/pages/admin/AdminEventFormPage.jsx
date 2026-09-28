import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarPlus,
  Edit3,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Check,
} from 'lucide-react'
import { eventService } from '../../services/eventService.js'
import { adminService } from '../../services/adminService.js'
import LoadingState from '../../components/common/LoadingState.jsx'

const CATEGORIES = ['Hackathon', 'Workshop', 'Coding Contest', 'Cultural']

export default function AdminEventFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    date: '',
    time: '',
    venue: '',
    image_url: '',
    is_featured: false,
  })

  const [loadingInitial, setLoadingInitial] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEditMode) return

    let isMounted = true
    eventService
      .getEventById(id)
      .then((data) => {
        if (isMounted && data) {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            category: data.category || CATEGORIES[0],
            date: data.date ? data.date.split('T')[0] : '',
            time: data.time || '',
            venue: data.venue || '',
            image_url: data.image_url || '',
            is_featured: Boolean(data.is_featured),
          })
          setLoadingInitial(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load event data for editing.')
          setLoadingInitial(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [id, isEditMode])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (saving) return

    // Field presence checks
    if (!formData.title.trim() || !formData.description.trim() || !formData.date || !formData.time.trim() || !formData.venue.trim()) {
      setError('Please fill in all mandatory event fields.')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        date: formData.date,
        time: formData.time.trim(),
        venue: formData.venue.trim(),
        image_url: formData.image_url.trim() || null,
        is_featured: formData.is_featured,
      }

      if (isEditMode) {
        await adminService.updateEvent(id, payload)
      } else {
        await adminService.createEvent(payload)
      }

      navigate('/admin/events')
    } catch (err) {
      setError(err.message || 'Failed to save event. Please check inputs and try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loadingInitial) {
    return <LoadingState message="Loading event details..." />
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Back button */}
      <div>
        <Link
          to="/admin/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Directory</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="border-b border-emerald-100 pb-5">
        <div className="flex items-center gap-2 mb-1">
          {isEditMode ? (
            <Edit3 className="w-5 h-5 text-emerald-600" />
          ) : (
            <CalendarPlus className="w-5 h-5 text-emerald-600" />
          )}
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isEditMode ? 'Edit Campus Event' : 'Create New Campus Event'}
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          {isEditMode
            ? 'Update event schedule, venue, banner, or promotional status.'
            : 'Fill in the details below to publish a new activity to the club catalog.'}
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="font-medium leading-relaxed">{error}</div>
        </div>
      )}

      {/* Main Form Card */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Event Title */}
          <div>
            <label htmlFor="title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Winter Hackathon 2026"
              disabled={saving}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Event Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a comprehensive description of the event agenda, topics covered, and who should attend..."
              disabled={saving}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 transition-all resize-y"
            />
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={saving}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Scheduled Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                value={formData.date}
                onChange={handleChange}
                disabled={saving}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 transition-all"
              />
            </div>
          </div>

          {/* Time & Venue Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="time" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Time Window <span className="text-rose-500">*</span>
              </label>
              <input
                id="time"
                name="time"
                type="text"
                required
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g. 14:00 - 17:30"
                disabled={saving}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </div>

            <div>
              <label htmlFor="venue" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Campus Venue <span className="text-rose-500">*</span>
              </label>
              <input
                id="venue"
                name="venue"
                type="text"
                required
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Computer Science Lab 3"
                disabled={saving}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </div>
          </div>

          {/* Image Banner URL with Live Preview */}
          <div>
            <label htmlFor="image_url" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Banner Image URL <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <input
                id="image_url"
                name="image_url"
                type="url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                disabled={saving}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </div>

            {formData.image_url && (
              <div className="mt-3 relative h-36 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={formData.image_url}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Featured Spotlight Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/90 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                disabled={saving}
                className="w-4 h-4 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Promote as Featured Spotlight
                </span>
                <span className="text-[11px] text-slate-500">
                  Featured events are spotlighted prominently on the home page hero section.
                </span>
              </div>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-3 justify-end">
            <Link
              to="/admin/events"
              className="py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 py-2.5 px-6 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 rounded-xl transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Event...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditMode ? 'Save Changes' : 'Publish Event'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
