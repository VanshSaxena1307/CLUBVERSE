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
}
