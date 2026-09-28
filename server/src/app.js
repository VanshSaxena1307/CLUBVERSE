import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import './config/supabase.js'
import apiRoutes from './routes/index.js'
import { errorHandler } from './middleware/errorMiddleware.js'

const app = express()

// CORS configuration supporting local development and deployed Vercel production frontend
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://clubverse-three.vercel.app',
]

const envOrigins = env.CLIENT_URL
  ? env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/+$/, ''))
  : []

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envOrigins].filter(Boolean)))

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g. curl, postman, health check)
      if (!origin) return callback(null, true)

      const normalized = origin.trim().replace(/\/+$/, '')
      if (
        allowedOrigins.includes(normalized) ||
        /^https:\/\/clubverse.*\.vercel\.app$/.test(normalized)
      ) {
        return callback(null, true)
      }

      return callback(null, false)
    },
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
