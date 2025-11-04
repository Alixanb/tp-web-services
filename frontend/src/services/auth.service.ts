import type { LoginDto, CreateUserDto, AuthResponse, User } from '@/types/User'
import { apiClient } from '@/lib/api-client'

export const authService = {
  // POST /auth/login - Authentification
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    // Stocker le token et l'utilisateur
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    return response
  },

  // POST /auth/register - Création de compte
  async register(data: CreateUserDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    // Stocker le token et l'utilisateur
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    return response
  },

  // Logout
  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Get current user from storage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Get token
  getToken(): string | null {
    return localStorage.getItem('token')
  },

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
