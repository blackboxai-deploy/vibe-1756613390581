// Authentication utilities for the dropshipping platform
import { User } from '@/types'
import { db } from './db'

const JWT_SECRET = 'demo-secret-key' // In production, use environment variable
const JWT_EXPIRES_IN = '7d'

export interface AuthToken {
  token: string
  user: User
  expiresAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

// Simple hash function for demo (use bcrypt in production)
export async function hashPassword(password: string): Promise<string> {
  // Simple base64 encoding for demo - use bcrypt in production
  return Buffer.from(password).toString('base64')
}

// Simple verify function for demo (use bcrypt in production)
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // Simple comparison for demo - use bcrypt in production
  return Buffer.from(password).toString('base64') === hashedPassword
}

// Simple JWT-like token generation for demo
export function generateToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  }
  // Simple base64 encoding for demo - use proper JWT in production
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

// Simple token verification for demo
export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    
    // Check expiration
    if (Date.now() > payload.exp) {
      return null
    }
    
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    }
  } catch (error) {
    return null
  }
}

// Register new user
export async function registerUser(userData: RegisterData): Promise<AuthToken> {
  // Check if user already exists
  const existingUser = await db.getUserByEmail(userData.email)
  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  // Hash password (stored for reference but not used in demo)
  await hashPassword(userData.password)

  // Create user (in real implementation, save hashedPassword to database)
  const user = await db.createUser({
    name: userData.name,
    email: userData.email,
    role: 'customer'
  })

  // Generate token
  const token = generateToken(user)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  return {
    token,
    user,
    expiresAt
  }
}

// Login user
export async function loginUser(credentials: LoginCredentials): Promise<AuthToken> {
  // Get user by email
  const user = await db.getUserByEmail(credentials.email)
  if (!user) {
    throw new Error('Invalid email or password')
  }

  // In real implementation, verify password against stored hash
  // For now, accept any password for demo purposes
  const isValidPassword = true // await verifyPassword(credentials.password, user.hashedPassword)
  
  if (!isValidPassword) {
    throw new Error('Invalid email or password')
  }

  // Generate token
  const token = generateToken(user)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  return {
    token,
    user,
    expiresAt
  }
}

// Get current user from token
export async function getCurrentUser(token: string): Promise<User | null> {
  const decoded = verifyToken(token)
  if (!decoded) {
    return null
  }

  return await db.getUserById(decoded.userId)
}

// Middleware function to extract user from request
export function extractUserFromRequest(authHeader?: string): { userId: string; email: string; role: string } | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  return verifyToken(token)
}

// Session management for guest users
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Validate user permissions
export function hasPermission(userRole: string, requiredRole: 'customer' | 'admin'): boolean {
  if (requiredRole === 'admin') {
    return userRole === 'admin'
  }
  return userRole === 'customer' || userRole === 'admin'
}

// Create admin user (for development)
export async function createAdminUser(): Promise<User> {
  const adminEmail = 'admin@fashionstore.com'
  
  // Check if admin already exists
  const existingAdmin = await db.getUserByEmail(adminEmail)
  if (existingAdmin) {
    return existingAdmin
  }

  // Create admin user
  return await db.createUser({
    name: 'Store Administrator',
    email: adminEmail,
    role: 'admin'
  })
}