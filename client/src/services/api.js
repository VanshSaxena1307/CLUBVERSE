const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Lightweight fetch wrapper for CLUBVERSE backend API
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const headers = {
    'Content-Type': 'application/json',
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
