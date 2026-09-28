import { Router } from 'express'
import { authController } from '../controllers/authController.js'

const router = Router()

/**
 * Admin Authentication Route
 * POST /api/auth/login
 */
router.post('/login', authController.login)

export default router
