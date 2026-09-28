import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

/**
 * Reusable Admin Authentication Middleware
 * Validates HTTP Header: Authorization: Bearer <token>
 */
export const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin authentication token required.',
    })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Malformed authorization header.',
    })
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)
    req.admin = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      error:
        error.name === 'TokenExpiredError'
          ? 'Unauthorized: Session expired. Please log in again.'
          : 'Unauthorized: Invalid authentication token.',
    })
  }
}
