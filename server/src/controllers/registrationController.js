import { registrationService } from '../services/registrationService.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/

export const registrationController = {
  /**
   * POST /api/registrations (or /api/events/:id/register)
   * Public: Students sign up for events without login
   */
  async createRegistration(req, res, next) {
    try {
      const event_id = req.params.id || req.body.event_id
      const { name, email, college, year, phone } = req.body

      const errors = []
      if (!event_id?.trim()) errors.push('event_id is required')
      if (!name?.trim()) errors.push('name is required')
      if (!email?.trim()) {
        errors.push('email is required')
      } else if (!EMAIL_REGEX.test(email.trim())) {
        errors.push('email must be a valid email address')
      }
      if (!college?.trim()) errors.push('college/department is required')
      if (!year?.trim()) errors.push('year of study is required')
      if (!phone?.trim()) {
        errors.push('phone number is required')
      } else if (!PHONE_REGEX.test(phone.trim())) {
        errors.push('phone number format is invalid')
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          error: errors.join('; '),
          details: errors,
        })
      }

      const result = await registrationService.createRegistration({
        event_id: event_id.trim(),
        name,
        email,
        college,
        year,
        phone,
      })

      res.status(201).json({
        success: true,
        message: 'Registration confirmed successfully',
        registrationId: result.registration.id,
        data: result.registration,
        event: result.event,
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

  /**
   * GET /api/registrations
   * Protected: Admin attendee directory
   */
  async getRegistrations(req, res, next) {
    try {
      const { eventId } = req.query
      const registrations = await registrationService.getRegistrations({ eventId })

      res.status(200).json({
        success: true,
        count: registrations.length,
        data: registrations,
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * GET /api/registrations/:id
   * Protected: Single registration detail
   */
  async getRegistrationById(req, res, next) {
    try {
      const { id } = req.params
      const registration = await registrationService.getRegistrationById(id)

      if (!registration) {
        return res.status(404).json({
          success: false,
          error: 'Registration record not found',
        })
      }

      res.status(200).json({
        success: true,
        data: registration,
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * GET /api/registrations/by-email?email=<email>
   * Public: Student lookup of their registered events
   */
  async getRegistrationsByEmail(req, res, next) {
    try {
      const { email } = req.query
      if (!email || typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Email parameter is required',
        })
      }

      const trimmedEmail = email.trim()
      if (!EMAIL_REGEX.test(trimmedEmail)) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a valid email address',
        })
      }

      const registrations = await registrationService.getRegistrationsByEmail(trimmedEmail)

      res.status(200).json({
        success: true,
        count: registrations.length,
        data: registrations,
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * GET /api/registrations/:id/ticket
   * Public: Retrieve digital event ticket by registration ID
   */
  async getTicketById(req, res, next) {
    try {
      const { id } = req.params
      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Invalid registration ID',
        })
      }

      const ticket = await registrationService.getTicketById(id.trim())
      if (!ticket) {
        return res.status(404).json({
          success: false,
          error: 'Event ticket not found for this registration ID',
        })
      }

      res.status(200).json({
        success: true,
        data: ticket,
      })
    } catch (error) {
      next(error)
    }
  },
}
