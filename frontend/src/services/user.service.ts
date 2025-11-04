import type { User, UpdateUserDto } from '@/types/User'
import { apiClient } from '@/lib/api-client'

export const userService = {
  // GET /users/{id} - Profil utilisateur
  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`)
  },

  // PUT /users/{id} - Modification du profil
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    return apiClient.put<User>(`/users/${id}`, data)
  },

  // GET /users - Liste des utilisateurs (Admin)
  async getAllUsers(): Promise<User[]> {
    return apiClient.get<User[]>('/users')
  },
}
