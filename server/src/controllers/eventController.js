import { eventService } from '../services/eventService.js'

export const eventController = {
  /**
   * GET /api/events
   * Query params: search, category, featured
   */
  async getEvents(req, res, next) {
    try {
      const { search, category, featured } = req.query
      const events = await eventService.getAllEvents({ search, category, featured })

      res.status(200).json({
        success: true,
        count: events.length,
        data: events,
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * GET /api/events/:id
   */
  async getEventById(req, res, next) {
    try {
      const { id } = req.params
      const event = await eventService.getEventById(id)

      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found with the requested ID',
        })
      }

      res.status(200).json({
        success: true,
        data: event,
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * POST /api/events
   */
  async createEvent(req, res, next) {
    try {
      const { title, description, category, date, time, venue, image_url, is_featured } = req.body

      // Basic field presence validation
      const missingFields = []
      if (!title?.trim()) missingFields.push('title')
      if (!description?.trim()) missingFields.push('description')
      if (!category?.trim()) missingFields.push('category')
      if (!date?.trim()) missingFields.push('date')
      if (!time?.trim()) missingFields.push('time')
      if (!venue?.trim()) missingFields.push('venue')

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Missing required event fields: ${missingFields.join(', ')}`,
        })
      }

      const createdEvent = await eventService.createEvent({
        title,
        description,
        category,
        date,
        time,
        venue,
        image_url,
        is_featured,
      })

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: createdEvent,
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * PUT /api/events/:id
   */
  async updateEvent(req, res, next) {
    try {
      const { id } = req.params
      const updatedEvent = await eventService.updateEvent(id, req.body)

      if (!updatedEvent) {
        return res.status(404).json({
          success: false,
          error: 'Event not found with the requested ID',
        })
      }

      res.status(200).json({
        success: true,
        message: 'Event updated successfully',
        data: updatedEvent,
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * DELETE /api/events/:id
   */
  async deleteEvent(req, res, next) {
    try {
      const { id } = req.params
      const deletedEvent = await eventService.deleteEvent(id)

      if (!deletedEvent) {
        return res.status(404).json({
          success: false,
          error: 'Event not found with the requested ID',
        })
      }

      res.status(200).json({
        success: true,
        message: 'Event deleted successfully',
      })
    } catch (error) {
      next(error)
    }
  },
}
