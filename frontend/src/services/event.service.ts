import type {
  Event,
  CreateEventDto,
  UpdateEventDto,
  EventFilters,
} from '@/types/Event'
import { apiClient } from '@/lib/api-client'

export const eventService = {
  // GET /events - Recherche et filtrage
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    return apiClient.get<Event[]>('/events', filters)
  },

  // GET /events/{id} - Détails d'un événement
  async getEventById(id: string): Promise<Event> {
    return apiClient.get<Event>(`/events/${id}`)
  },

  // POST /events - Création (Organisateur)
  async createEvent(data: CreateEventDto): Promise<Event> {
    return apiClient.post<Event>('/events', data)
  },

  // PUT /events/{id} - Modification (Organisateur)
  async updateEvent(id: string, data: UpdateEventDto): Promise<Event> {
    return apiClient.put<Event>(`/events/${id}`, data)
  },

  // DELETE /events/{id} - Suppression (Organisateur/Admin)
  async deleteEvent(id: string): Promise<void> {
    return apiClient.delete<void>(`/events/${id}`)
  },
}
