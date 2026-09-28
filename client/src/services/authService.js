import { apiRequest } from './api.js'

export const authService = {
  /**
   * Authenticate admin credentials
   */
  async login({ email, password }) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    return response
  },
}
