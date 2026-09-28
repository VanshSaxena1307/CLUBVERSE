import { Router } from 'express'

const router = Router()

/**
 * Structural Route Placeholder: Auth Routes (/api/auth)
 * Full implementation (login, JWT issuing, bcrypt verification) scheduled for Phase 3.
 */
router.post('/login', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Auth login endpoint placeholder — full authentication scheduled for Phase 3',
  })
})

export default router
