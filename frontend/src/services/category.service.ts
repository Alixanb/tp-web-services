import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/types/Category'
import { mockApi } from '@/lib/mock-api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const USE_MOCK = true // Mettre à false quand l'API sera prête

export const categoryService = {
  // GET /categories - Liste des catégories
  async getCategories(): Promise<Category[]> {
    if (USE_MOCK) return mockApi.getCategories()
    // TODO: Implémenter avec l'API réelle
    throw new Error('Not implemented')
  },

  // GET /categories/{id} - Détails d'une catégorie
  async getCategoryById(id: string): Promise<Category> {
    if (USE_MOCK) return mockApi.getCategoryById(id)
    // TODO: Implémenter avec l'API réelle
    throw new Error('Not implemented')
  },

  // POST /categories - Création (Admin)
  async createCategory(data: CreateCategoryDto): Promise<Category> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // PUT /categories/{id} - Modification (Admin)
  async updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // DELETE /categories/{id} - Suppression (Admin)
  async deleteCategory(id: string): Promise<void> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },
}
