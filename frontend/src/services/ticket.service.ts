import type { Ticket, UpdateTicketDto, TicketValidation } from '@/types/Ticket'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const ticketService = {
  // GET /tickets/{id} - Détails d'un billet
  async getTicketById(id: string): Promise<Ticket> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // GET /orders/{id}/tickets - Liste des billets d'une commande
  async getOrderTickets(orderId: string): Promise<Ticket[]> {
    // TODO: Implémenter avec l'API
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
