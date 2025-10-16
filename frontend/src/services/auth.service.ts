import type { LoginDto, CreateUserDto, AuthResponse, User } from '@/types/User'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const authService = {
  // POST /auth/login - Authentification
  async login(credentials: LoginDto): Promise<AuthResponse> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // POST /users - Création de compte
  async register(data: CreateUserDto): Promise<AuthResponse> {
    // TODO: Implémenter avec l'API
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
