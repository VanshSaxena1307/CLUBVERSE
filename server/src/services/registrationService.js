import { supabase } from '../config/supabase.js'
import { eventService } from './eventService.js'

function getDb() {
  if (!supabase) {
    throw new Error('Database connection is not initialized. Check server environment variables.')
  }
  return supabase
}

export const registrationService = {
  /**
   * Create a registration for an event after verifying event existence
   */
  async createRegistration(registrationData) {
    const db = getDb()
    const { event_id, name, email, college, year, phone } = registrationData

    // 1. Verify referenced event exists
    const event = await eventService.getEventById(event_id)
    if (!event) {
      const err = new Error('The referenced event does not exist or has been removed.')
      err.statusCode = 404
      throw err
    }

    // 2. Check for duplicate registration for same email and event
    const normalizedEmail = email.trim().toLowerCase()
    const { data: existingReg, error: checkError } = await db
      .from('registrations')
      .select('id')
      .eq('event_id', event_id)
      .ilike('email', normalizedEmail)
      .maybeSingle()

    if (checkError) {
      console.warn('[RegistrationService] Duplicate check warning:', checkError.message)
    }

    if (existingReg) {
      const err = new Error('You have already registered for this event with this email address.')
      err.statusCode = 409
      throw err
    }

    // 3. Insert registration record
    const { data, error } = await db
      .from('registrations')
      .insert([
        {
          event_id,
          name: name.trim(),
          email: normalizedEmail,
          college: college.trim(),
          year: year.trim(),
          phone: phone.trim(),
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to submit registration: ${error.message}`)
    }

    return {
      registration: data,
      event: {
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time,
        venue: event.venue,
      },
    }
  },

  /**
   * Fetch registrations with optional eventId filter
   */
  async getRegistrations({ eventId } = {}) {
    const db = getDb()
    let query = db
      .from('registrations')
      .select('*, events(id, title, category, date, venue)')
      .order('registered_at', { ascending: false })

    if (eventId && eventId !== 'all') {
      query = query.eq('event_id', eventId)
    }

    const { data, error } = await query
    if (error) {
      throw new Error(`Failed to fetch registrations: ${error.message}`)
    }
    return data || []
  },

  /**
   * Fetch single registration by ID
   */
  async getRegistrationById(id) {
    const db = getDb()
    const { data, error } = await db
      .from('registrations')
      .select('*, events(id, title, category, date, venue)')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw new Error(`Failed to fetch registration: ${error.message}`)
    }
    return data
  },

  /**
   * Fetch public registrations by student email (joined with event details)
   */
  async getRegistrationsByEmail(email) {
    const db = getDb()
    const normalizedEmail = email.trim().toLowerCase()

    const { data, error } = await db
      .from('registrations')
      .select('id, event_id, name, email, college, year, phone, registered_at, events(id, title, category, date, time, venue, image_url, description)')
      .ilike('email', normalizedEmail)
      .order('registered_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to lookup registrations: ${error.message}`)
    }

    return (data || []).map((reg) => ({
      ...reg,
      event: reg.events || null,
    }))
  },

  /**
   * Fetch single registration ticket details by ID (joined with event details)
   */
  async getTicketById(id) {
    const db = getDb()
    const { data, error } = await db
      .from('registrations')
      .select('id, event_id, name, email, college, year, phone, registered_at, events(id, title, category, date, time, venue, image_url, description)')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw new Error(`Failed to fetch ticket: ${error.message}`)
    }

    if (!data) return null

    return {
      ...data,
      event: data.events || null,
    }
  },
}
