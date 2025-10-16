import type { User } from './User'
import type { Ticket } from './Ticket'

export type OrderStatus =
  | 'PENDING'
  | 'RESERVED'
  | 'PAID'
  | 'CANCELLED'
  | 'REFUNDED'

export interface Order {
  id: string
  user: User
  orderDate: Date
  status: OrderStatus
  totalAmount: number
  tickets: Ticket[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateOrderDto {
  ticketCategoryId: string
  quantity: number
}

export interface OrderItem {
  ticketCategoryId: string
  quantity: number
  price: number
}

export interface CreateOrderRequest {
  items: OrderItem[]
}

export interface OrderSummary {
  orderId: string
  totalAmount: number
  ticketCount: number
  status: OrderStatus
}
