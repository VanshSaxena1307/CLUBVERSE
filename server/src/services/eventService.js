import { supabase } from '../config/supabase.js'

function getDb() {
  if (!supabase) {
    throw new Error('Database connection is not initialized. Check server environment variables.')
  }
  return supabase
}

export const eventService = {
  /**
   * Fetch all events with optional title search, category filter, and sensible date sorting
   */
  async getAllEvents({ search, category, featured } = {}) {
    const db = getDb()
    let query = db
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (category && category.toLowerCase() !== 'all') {
      query = query.eq('category', category)
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`
      query = query.or(`title.ilike.${term},description.ilike.${term}`)
    }

    if (featured !== undefined && featured !== null && featured !== '') {
      const isFeatured = featured === 'true' || featured === true
      query = query.eq('is_featured', isFeatured)
    }

    const { data, error } = await query
    if (error) {
      throw new Error(`Failed to fetch events: ${error.message}`)
    }
    return data || []
  },

  /**
   * Fetch single event by UUID
   */
  async getEventById(id) {
    const db = getDb()
    const { data, error } = await db
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw new Error(`Failed to fetch event: ${error.message}`)
    }
    return data
  },

  /**
   * Create a new event
   */
  async createEvent(eventData) {
    const db = getDb()
    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      image_url = null,
      is_featured = false,
    } = eventData

    const { data, error } = await db
      .from('events')
      .insert([
        {
          title: title.trim(),
          description: description.trim(),
          category: category.trim(),
          date,
          time: time.trim(),
          venue: venue.trim(),
          image_url: image_url ? image_url.trim() : null,
          is_featured: Boolean(is_featured),
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create event: ${error.message}`)
    }
    return data
  },

  /**
   * Update an existing event by ID
   */
  async updateEvent(id, updateData) {
    const db = getDb()
    const payload = { ...updateData, updated_at: new Date().toISOString() }

    // Sanitize string fields if provided
    if (payload.title) payload.title = payload.title.trim()
    if (payload.description) payload.description = payload.description.trim()
    if (payload.category) payload.category = payload.category.trim()
    if (payload.time) payload.time = payload.time.trim()
    if (payload.venue) payload.venue = payload.venue.trim()

    const { data, error } = await db
      .from('events')
      .update(payload)
      .eq('id', id)
      .select()
      .maybeSingle()

    if (error) {
      throw new Error(`Failed to update event: ${error.message}`)
    }
    return data
  },

  /**
   * Delete an event by ID (cascades registrations)
   */
  async deleteEvent(id) {
    const db = getDb()
    const { data, error } = await db
      .from('events')
      .delete()
      .eq('id', id)
      .select()
      .maybeSingle()

    if (error) {
      throw new Error(`Failed to delete event: ${error.message}`)
    }
    return data
  },
}
