import type {
  Order,
  CreateOrderRequest,
  OrderSummary,
  OrderStatus,
} from '@/types/Order'
import { apiClient } from '@/lib/api-client'

export const orderService = {
  // POST /orders - Création d'une commande
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    return apiClient.post<Order>('/orders', data)
  },

  // GET /orders/{id} - Détails d'une commande
  async getOrderById(id: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`)
  },

  // GET /users/{id}/orders - Historique des commandes
  async getUserOrders(userId: string): Promise<Order[]> {
    return apiClient.get<Order[]>(`/users/${userId}/orders`)
  },

  // GET /orders - Toutes les commandes (pour admin/organisateur)
  async getAllOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>('/orders')
  },
}
