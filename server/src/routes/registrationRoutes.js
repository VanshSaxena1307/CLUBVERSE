import { Router } from 'express'
import { registrationController } from '../controllers/registrationController.js'
import { requireAdminAuth } from '../middleware/authMiddleware.js'

const router = Router()

// Public: Student event registration & lookup
router.post('/', registrationController.createRegistration)
router.get('/by-email', registrationController.getRegistrationsByEmail)
router.get('/:id/ticket', registrationController.getTicketById)

// Protected: Admin attendee directory & inspection
router.get('/', requireAdminAuth, registrationController.getRegistrations)
router.get('/:id', requireAdminAuth, registrationController.getRegistrationById)

export default router
