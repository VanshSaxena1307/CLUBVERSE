import { apiRequest } from './api.js'

export const adminService = {
  /**
   * Create new event (Admin protected)
   */
  async createEvent(eventData) {
    const response = await apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    })
    return response.data
  },

  /**
   * Update existing event (Admin protected)
   */
  async updateEvent(id, eventData) {
    const response = await apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    })
    return response.data
  },

  /**
   * Delete event (Admin protected)
   */
  async deleteEvent(id) {
    const response = await apiRequest(`/events/${id}`, {
      method: 'DELETE',
    })
    return response
  },

  /**
   * Fetch all student registrations (Admin protected)
   */
  async getRegistrations({ eventId } = {}) {
    const params = new URLSearchParams()
    if (eventId && eventId !== 'all') {
      params.append('eventId', eventId)
    }
    const query = params.toString() ? `?${params.toString()}` : ''
    const response = await apiRequest(`/registrations${query}`)
    return response.data || []
  },

  /**
   * Fetch single registration detail (Admin protected)
   */
  async getRegistrationById(id) {
    const response = await apiRequest(`/registrations/${id}`)
    return response.data
  },
}
