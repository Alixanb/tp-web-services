import type { User, UpdateUserDto } from '@/types/User'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const userService = {
  // GET /users/{id} - Profil utilisateur
  async getUserById(id: string): Promise<User> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // PUT /users/{id} - Modification du profil
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // GET /users - Liste des utilisateurs (Admin)
  async getAllUsers(): Promise<User[]> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },
}
