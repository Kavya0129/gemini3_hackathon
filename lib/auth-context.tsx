import React, { createContext, useContext, useState, useEffect } from 'react'
import type { UserProfile, MonthlySnapshot } from './types'

export interface AuthUser extends UserProfile {
  id: string
  email: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, profile: UserProfile) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    // Initialize demo user if no users exist
    const allUsers = JSON.parse(localStorage.getItem('finwise-users') || '[]')
    if (allUsers.length === 0) {
      const demoUser = {
        id: '1',
        email: 'demo@example.com',
        password: 'demo123',
        name: 'Alex Johnson',
        financialGoals: ['Save 6 months emergency fund', 'Invest in index funds', 'Buy a house in 5 years'],
        riskTolerance: 'moderate' as const,
        monthlyBudget: 5000,
      }
      localStorage.setItem('finwise-users', JSON.stringify([demoUser]))
    }

    const storedUser = localStorage.getItem('finwise-user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('finwise-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Demo authentication - in production, this would call a backend API
      // Check if user exists in localStorage
      const allUsers = JSON.parse(localStorage.getItem('finwise-users') || '[]')
      const existingUser = allUsers.find(
        (u: any) => u.email === email && u.password === password
      )

      if (!existingUser) {
        throw new Error('Invalid email or password')
      }

      const { password: _, ...userWithoutPassword } = existingUser
      setUser(userWithoutPassword)
      localStorage.setItem('finwise-user', JSON.stringify(userWithoutPassword))
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, profile: UserProfile) => {
    setIsLoading(true)
    try {
      // Check if user already exists
      const allUsers = JSON.parse(localStorage.getItem('finwise-users') || '[]')
      if (allUsers.some((u: any) => u.email === email)) {
        throw new Error('User already exists')
      }

      // Create new user
      const newUser: AuthUser = {
        id: Date.now().toString(),
        email,
        ...profile,
      }

      // Store user with password (demo only - never do this in production)
      allUsers.push({ ...newUser, password })
      localStorage.setItem('finwise-users', JSON.stringify(allUsers))

      setUser(newUser)
      localStorage.setItem('finwise-user', JSON.stringify(newUser))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('finwise-user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
