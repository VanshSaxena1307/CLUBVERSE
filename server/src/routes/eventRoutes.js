import { Router } from 'express'
import { eventController } from '../controllers/eventController.js'
import { registrationController } from '../controllers/registrationController.js'

const router = Router()

// Public event browsing endpoints
router.get('/', eventController.getEvents)
router.get('/:id', eventController.getEventById)

// Direct event registration endpoint (alias for /api/registrations)
router.post('/:id/register', registrationController.createRegistration)

// Event mutation endpoints (CRUD)
router.post('/', eventController.createEvent)
router.put('/:id', eventController.updateEvent)
router.delete('/:id', eventController.deleteEvent)

export default router
