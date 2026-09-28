import { Router } from 'express'
import { eventController } from '../controllers/eventController.js'
import { registrationController } from '../controllers/registrationController.js'
import { requireAdminAuth } from '../middleware/authMiddleware.js'

const router = Router()

// Public event browsing endpoints
router.get('/', eventController.getEvents)
router.get('/:id', eventController.getEventById)

// Public direct registration alias
router.post('/:id/register', registrationController.createRegistration)

// Protected event mutation endpoints (Admin JWT Required)
router.post('/', requireAdminAuth, eventController.createEvent)
router.put('/:id', requireAdminAuth, eventController.updateEvent)
router.delete('/:id', requireAdminAuth, eventController.deleteEvent)

export default router
