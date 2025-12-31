'use client'

import { useState, useEffect, useCallback } from 'react'
import { User } from '@/types/user'
import { authService } from '@/services/authService.mock'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials: { username: string; password: string }) => {
    try {
      const loggedInUser = await authService.login(credentials)
      setUser(loggedInUser)
      return loggedInUser
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const isAuthenticated = useCallback(() => {
    return user !== null
  }, [user])

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
  }
}

