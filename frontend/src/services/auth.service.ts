import type { LoginDto, CreateUserDto, AuthResponse, User } from '@/types/User'
import { mockApi } from '@/lib/mock-api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const USE_MOCK = true // Mettre à false quand l'API sera prête

export const authService = {
  // POST /auth/login - Authentification
  async login(credentials: LoginDto): Promise<AuthResponse> {
    if (USE_MOCK) {
      const response = await mockApi.login(credentials)
      // Stocker le token et l'utilisateur
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      return response
    }
    // TODO: Implémenter avec l'API réelle
    throw new Error('Not implemented')
  },

  // POST /users - Création de compte
  async register(data: CreateUserDto): Promise<AuthResponse> {
    if (USE_MOCK) {
      const response = await mockApi.register(data)
      // Stocker le token et l'utilisateur
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      return response
    }
    // TODO: Implémenter avec l'API réelle
    throw new Error('Not implemented')
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
