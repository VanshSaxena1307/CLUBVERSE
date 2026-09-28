import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase.js'
import { env } from '../config/env.js'

function getDb() {
  if (!supabase) {
    throw new Error('Database connection is not initialized. Check server environment variables.')
  }
  return supabase
}

export const authService = {
  /**
   * Verify admin credentials and issue signed JWT
   */
  async login({ email, password }) {
    if (!email?.trim() || !password) {
      const err = new Error('Email and password are required.')
      err.statusCode = 400
      throw err
    }

    const db = getDb()
    const normalizedEmail = email.trim().toLowerCase()

    // 1. Fetch admin by email
    const { data: admin, error } = await db
      .from('admins')
      .select('id, email, password_hash, created_at')
      .ilike('email', normalizedEmail)
      .maybeSingle()

    if (error) {
      throw new Error(`Database error during authentication: ${error.message}`)
    }

    if (!admin) {
      const err = new Error('Invalid email or password.')
      err.statusCode = 401
      throw err
    }

    // 2. Compare password with bcrypt hash
    const isPasswordValid = bcrypt.compareSync(password, admin.password_hash)
    if (!isPasswordValid) {
      const err = new Error('Invalid email or password.')
      err.statusCode = 401
      throw err
    }

    // 3. Sign JWT session token (Do NOT include password_hash)
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: 'admin',
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    )

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    }
  },
}
