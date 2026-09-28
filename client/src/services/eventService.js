import { apiRequest } from './api.js'

export const eventService = {
  /**
   * Fetch events with optional query parameters (search, category, featured)
   */
  async getEvents({ search, category, featured } = {}) {
    const params = new URLSearchParams()
    if (search && search.trim()) params.append('search', search.trim())
    if (category && category !== 'All') params.append('category', category)
    if (featured !== undefined && featured !== null) params.append('featured', String(featured))

    const query = params.toString() ? `?${params.toString()}` : ''
    const response = await apiRequest(`/events${query}`)
    return response.data || []
  },

  /**
   * Fetch single event details by ID
   */
  async getEventById(id) {
    const response = await apiRequest(`/events/${id}`)
    return response.data
  },
}
