import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/types/Category'
import { apiClient } from '@/lib/api-client'

export const categoryService = {
  // GET /categories - Liste des catégories
  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories')
  },

  // GET /categories/{id} - Détails d'une catégorie
  async getCategoryById(id: string): Promise<Category> {
    return apiClient.get<Category>(`/categories/${id}`)
  },

  // POST /categories - Création (Admin)
  async createCategory(data: CreateCategoryDto): Promise<Category> {
    return apiClient.post<Category>('/categories', data)
  },

  // PUT /categories/{id} - Modification (Admin)
  async updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
    return apiClient.put<Category>(`/categories/${id}`, data)
  },

  // DELETE /categories/{id} - Suppression (Admin)
  async deleteCategory(id: string): Promise<void> {
    return apiClient.delete<void>(`/categories/${id}`)
  },
}
