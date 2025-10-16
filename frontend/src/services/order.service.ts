import type {
  Order,
  CreateOrderRequest,
  OrderSummary,
  OrderStatus,
} from '@/types/Order'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const orderService = {
  // POST /orders - Création d'une commande
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // GET /orders/{id} - Détails d'une commande
  async getOrderById(id: string): Promise<Order> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // GET /users/{id}/orders - Historique des commandes
  async getUserOrders(userId: string): Promise<Order[]> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // GET /orders - Toutes les commandes (pour admin/organisateur)
  async getAllOrders(): Promise<Order[]> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },
}
