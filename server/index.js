import app from './src/app.js'
import { env } from './src/config/env.js'

const PORT = env.PORT

const server = app.listen(PORT, () => {
  console.log(`[CLUBVERSE Server] Server running at http://localhost:${PORT}`)
  console.log(`[CLUBVERSE Server] Health check endpoint: http://localhost:${PORT}/api/health`)
  console.log(`[CLUBVERSE Server] Client CORS origin: ${env.CLIENT_URL}`)
})

export default server
