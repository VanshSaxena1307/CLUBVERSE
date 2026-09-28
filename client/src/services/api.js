const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Lightweight fetch wrapper for CLUBVERSE backend API.
 * Automatically attaches Authorization header if admin token is present in localStorage.
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const token = localStorage.getItem('clubverse_admin_token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  let json = null
  try {
    json = await response.json()
  } catch {
    // Response had no JSON body
  }

  if (!response.ok) {
    const errorMsg = json?.error || json?.message || `HTTP ${response.status}: ${response.statusText}`
    const error = new Error(errorMsg)
    error.status = response.status
    error.details = json?.details
    throw error
  }

  return json
}
