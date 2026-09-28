import { useState } from 'react'
import { authService } from '../services/authService.js'
import { AuthContext } from './authContext.js'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('clubverse_admin_token'))
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('clubverse_admin_user')
    try {
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const login = async (email, password) => {
    const data = await authService.login({ email, password })
    localStorage.setItem('clubverse_admin_token', data.token)
    localStorage.setItem('clubverse_admin_user', JSON.stringify(data.admin))
    setToken(data.token)
    setAdmin(data.admin)
    return data
  }

  const logout = () => {
    localStorage.removeItem('clubverse_admin_token')
    localStorage.removeItem('clubverse_admin_user')
    setToken(null)
    setAdmin(null)
  }

  const isAuthenticated = Boolean(token)

  return (
    <AuthContext.Provider value={{ token, admin, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
