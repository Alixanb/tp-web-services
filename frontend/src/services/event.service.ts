import type {
  Event,
  CreateEventDto,
  UpdateEventDto,
  EventFilters,
} from '@/types/Event'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const eventService = {
  // GET /events - Recherche et filtrage
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // GET /events/{id} - Détails d'un événement
  async getEventById(id: string): Promise<Event> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // POST /events - Création (Organisateur)
  async createEvent(data: CreateEventDto): Promise<Event> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // PUT /events/{id} - Modification (Organisateur)
  async updateEvent(id: string, data: UpdateEventDto): Promise<Event> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // DELETE /events/{id} - Suppression (Organisateur/Admin)
  async deleteEvent(id: string): Promise<void> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },
}
