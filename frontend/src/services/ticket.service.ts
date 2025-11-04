import type { Ticket, UpdateTicketDto, TicketValidation } from '@/types/Ticket'
import { apiClient } from '@/lib/api-client'

export const ticketService = {
  // GET /tickets/{id} - Détails d'un billet
  async getTicketById(id: string): Promise<Ticket> {
    return apiClient.get<Ticket>(`/tickets/${id}`)
  },

  // GET /orders/{id}/tickets - Liste des billets d'une commande
  // Note: Les tickets sont inclus dans la commande retournée par l'API
  // Cette méthode est gardée pour compatibilité mais peut récupérer via getOrderById
  async getOrderTickets(orderId: string): Promise<Ticket[]> {
    const order = await apiClient.get<any>(`/orders/${orderId}`)
    return order.tickets || []
  },

  // PUT /tickets/{id} - Modification de statut
  async updateTicket(id: string, data: UpdateTicketDto): Promise<Ticket> {
    return apiClient.put<Ticket>(`/tickets/${id}`, data)
  },

  // Validate ticket (scan QR code)
  // TODO: Vérifier l'endpoint exact dans l'API backend
  async validateTicket(qrCode: string): Promise<TicketValidation> {
    return apiClient.post<TicketValidation>('/tickets/validate', { qrCode })
  },
}
