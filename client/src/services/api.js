function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL

  if (!envUrl || !envUrl.trim()) {
    if (import.meta.env.PROD) {
      console.warn(
        '[CLUBVERSE] Warning: VITE_API_URL is missing in production. Falling back to local default. Please set VITE_API_URL in your Vercel project settings.'
      )
    }
    return 'http://localhost:5000/api'
  }

  let cleaned = envUrl.trim().replace(/\/+$/, '')

  // Ensure /api suffix is present so endpoints like /events resolve correctly
  if (!cleaned.endsWith('/api')) {
    cleaned = `${cleaned}/api`
  }

  return cleaned
}

const API_BASE_URL = getApiBaseUrl()

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
