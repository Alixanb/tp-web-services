import type {
  Order,
  CreateOrderRequest,
  OrderSummary,
  OrderStatus,
} from '@/types/Order'
import { mockApi } from '@/lib/mock-api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const USE_MOCK = true // Mettre à false quand l'API sera prête

export const orderService = {
  // POST /orders - Création d'une commande
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    if (USE_MOCK) return mockApi.createOrder(data.items)
    // TODO: Implémenter avec l'API réelle
    throw new Error('Not implemented')
  },

  // GET /orders/{id} - Détails d'une commande
  async getOrderById(id: string): Promise<Order> {
    if (USE_MOCK) return mockApi.getOrderById(id)
    // TODO: Implémenter avec l'API réelle
    throw new Error('Not implemented')
  },

  // GET /users/{id}/orders - Historique des commandes
  async getUserOrders(userId: string): Promise<Order[]> {
    if (USE_MOCK) return mockApi.getUserOrders(userId)
    // TODO: Implémenter avec l'API réelle
    throw new Error('Not implemented')
  },

  // GET /orders - Toutes les commandes (pour admin/organisateur)
  async getAllOrders(): Promise<Order[]> {
    if (USE_MOCK) return mockApi.getUserOrders('all')
    // TODO: Implémenter avec l'API réelle
    throw new Error('Not implemented')
  },
}
