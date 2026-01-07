"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { authApi, User, LoginCredentials, RegisterData } from "@/lib/api/auth"
import { ApiError } from "@/lib/api/client"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const setTokens = useCallback((accessToken: string, refreshToken: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", accessToken)
      localStorage.setItem("refresh_token", refreshToken)
    }
  }, [])

  const clearTokens = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    }
  }, [])

  const refreshAuth = useCallback(async () => {
    try {
      const refreshToken = typeof window !== "undefined" 
        ? localStorage.getItem("refresh_token") 
        : null

      if (!refreshToken) {
        throw new Error("No refresh token")
      }

      const tokens = await authApi.refreshToken(refreshToken)
      setTokens(tokens.access_token, tokens.refresh_token)

      const currentUser = await authApi.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      clearTokens()
      setUser(null)
      throw error
    }
  }, [setTokens, clearTokens])

  const loadUser = useCallback(async () => {
    try {
      const accessToken = typeof window !== "undefined" 
        ? localStorage.getItem("access_token") 
        : null

      if (!accessToken) {
        setIsLoading(false)
        return
      }

      const currentUser = await authApi.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        try {
          await refreshAuth()
        } catch {
          clearTokens()
          setUser(null)
        }
      } else {
        clearTokens()
        setUser(null)
      }
    } finally {
      setIsLoading(false)
    }
  }, [refreshAuth, clearTokens])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = async (credentials: LoginCredentials) => {
    try {
      const tokens = await authApi.login(credentials)
      setTokens(tokens.access_token, tokens.refresh_token)
      
      const currentUser = await authApi.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const tokens = await authApi.register(data)
      setTokens(tokens.access_token, tokens.refresh_token)
      
      const currentUser = await authApi.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
    } finally {
      clearTokens()
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}






