import type { Ticket, UpdateTicketDto, TicketValidation } from '@/types/Ticket'
import { mockApi } from '@/lib/mock-api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const USE_MOCK = true // Mettre à false quand l'API sera prête

export const ticketService = {
  // GET /tickets/{id} - Détails d'un billet
  async getTicketById(id: string): Promise<Ticket> {
    if (USE_MOCK) return mockApi.getTicketById(id)
    // TODO: Implémenter avec l'API réelle
    throw new Error('Not implemented')
  },

  // GET /orders/{id}/tickets - Liste des billets d'une commande
  async getOrderTickets(orderId: string): Promise<Ticket[]> {
    if (USE_MOCK) return mockApi.getOrderTickets(orderId)
    // TODO: Implémenter avec l'API réelle
    throw new Error('Not implemented')
  },

  // PUT /tickets/{id} - Modification de statut
  async updateTicket(id: string, data: UpdateTicketDto): Promise<Ticket> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // Validate ticket (scan QR code)
  async validateTicket(qrCode: string): Promise<TicketValidation> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },
}
