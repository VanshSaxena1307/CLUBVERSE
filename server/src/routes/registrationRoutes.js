import { Router } from 'express'

const router = Router()

/**
 * Structural Route Placeholder: Registration Routes (/api/registrations)
 * Full implementation (POST /register, GET /registrations) scheduled for Phase 2.
 */
router.get('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Registrations listing endpoint placeholder — full attendee management scheduled for Phase 2',
  })
})

export default router
