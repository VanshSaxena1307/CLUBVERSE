import { Router } from 'express'
import { registrationController } from '../controllers/registrationController.js'

const router = Router()

// Submit new registration
router.post('/', registrationController.createRegistration)

// Get registrations (with optional ?eventId= query filter)
router.get('/', registrationController.getRegistrations)

export default router
