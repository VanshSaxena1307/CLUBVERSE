import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import './config/supabase.js'
import apiRoutes from './routes/index.js'
import { errorHandler } from './middleware/errorMiddleware.js'

const app = express()

// CORS configuration supporting client origin
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
)

// JSON body parser
app.use(express.json())

// API routes
app.use('/api', apiRoutes)

// 404 Handler for undefined /api routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl} — API route not found`,
  })
})

// Centralized error handling middleware
app.use(errorHandler)

export default app
