import type {
  Event,
  CreateEventDto,
  UpdateEventDto,
  EventFilters,
} from '@/types/Event'
import { mockApi } from '@/lib/mock-api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const USE_MOCK = true // Mettre à false quand l'API sera prête

export const eventService = {
  // GET /events - Recherche et filtrage
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    if (USE_MOCK) return mockApi.getEvents(filters)
    // TODO: Implémenter avec l'API réelle
    throw new Error('Not implemented')
  },

  // GET /events/{id} - Détails d'un événement
  async getEventById(id: string): Promise<Event> {
    if (USE_MOCK) return mockApi.getEventById(id)
    // TODO: Implémenter avec l'API réelle
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
