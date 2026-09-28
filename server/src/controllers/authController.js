import { authService } from '../services/authService.js'

export const authController = {
  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const result = await authService.login({ email, password })

      res.status(200).json({
        success: true,
        message: 'Admin authenticated successfully',
        token: result.token,
        admin: result.admin,
      })
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
        })
      }
      next(error)
    }
  },
}
