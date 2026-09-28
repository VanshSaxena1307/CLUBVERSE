import { apiRequest } from './api.js'

export const registrationService = {
  /**
   * Submit student event registration
   */
  async registerForEvent(payload) {
    const response = await apiRequest('/registrations', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return response
  },

  /**
   * Public lookup of student registrations by email
   */
  async getRegistrationsByEmail(email) {
    const response = await apiRequest(`/registrations/by-email?email=${encodeURIComponent(email)}`)
    return response.data || []
  },

  /**
   * Public lookup of digital event ticket by registration ID
   */
  async getTicketById(registrationId) {
    const response = await apiRequest(`/registrations/${encodeURIComponent(registrationId)}/ticket`)
    return response.data || null
  },
}
