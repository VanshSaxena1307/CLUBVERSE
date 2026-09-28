/**
 * Centralized minimal Express error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err)

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error',
  })
}
