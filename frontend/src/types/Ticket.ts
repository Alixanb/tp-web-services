import type { Event } from './Event'

export type TicketStatus = 'ACTIVE' | 'USED' | 'TRANSFERRED' | 'CANCELLED'

export interface Ticket {
  id: string
  orderId: string
  event?: Event
  ticketCategoryName: string
  seatNumber?: string
  qrCode: string
  status: TicketStatus
  price: number
  createdAt: Date
  updatedAt: Date
}

export interface UpdateTicketDto {
  status?: TicketStatus
  seatNumber?: string
}

export interface TicketValidation {
  isValid: boolean
  ticket?: Ticket
  message: string
}
