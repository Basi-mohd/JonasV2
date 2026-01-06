import { api } from "./client"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface User {
  id: number
  email: string
  username: string
  level?: "beginner" | "intermediate" | "advanced" | null
  is_active: boolean
  is_superuser: boolean
  created_at: string
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    return api.post<TokenResponse>("/auth/login", credentials)
  },

  async register(data: RegisterData): Promise<TokenResponse> {
    return api.post<TokenResponse>("/auth/register", data)
  },

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    return api.post<TokenResponse>("/auth/refresh", { refresh_token: refreshToken })
  },

  async logout(): Promise<{ message: string }> {
    return api.post<{ message: string }>("/auth/logout")
  },

  async getCurrentUser(): Promise<User> {
    return api.get<User>("/users/me")
  },
}

