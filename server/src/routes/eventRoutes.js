import { Router } from 'express'

const router = Router()

/**
 * Structural Route Placeholder: Event Routes (/api/events)
 * Full implementation (GET, POST, PUT, DELETE) scheduled for Phase 2.
 */
router.get('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Events listing endpoint placeholder — full CRUD scheduled for Phase 2',
  })
})

router.get('/:id', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Event detail endpoint placeholder — full CRUD scheduled for Phase 2',
  })
})

export default router
