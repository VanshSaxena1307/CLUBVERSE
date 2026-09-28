import { Router } from 'express'
import authRoutes from './authRoutes.js'
import eventRoutes from './eventRoutes.js'
import registrationRoutes from './registrationRoutes.js'

const router = Router()

/**
 * Health check endpoint: GET /api/health
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CLUBVERSE API is running',
  })
})

// Structural route groups
router.use('/auth', authRoutes)
router.use('/events', eventRoutes)
router.use('/registrations', registrationRoutes)

export default router
