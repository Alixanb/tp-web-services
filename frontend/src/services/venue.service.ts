import type { Venue, CreateVenueDto, UpdateVenueDto } from '@/types/Venue'
import { apiClient } from '@/lib/api-client'

export const venueService = {
  // GET /venues - Liste des lieux
  async getVenues(): Promise<Venue[]> {
    return apiClient.get<Venue[]>('/venues')
  },

  // GET /venues/{id} - Détails d'un lieu
  async getVenueById(id: string): Promise<Venue> {
    return apiClient.get<Venue>(`/venues/${id}`)
  },

  // POST /venues - Création (Admin)
  async createVenue(data: CreateVenueDto): Promise<Venue> {
    return apiClient.post<Venue>('/venues', data)
  },

  // PUT /venues/{id} - Modification (Admin)
  async updateVenue(id: string, data: UpdateVenueDto): Promise<Venue> {
    return apiClient.put<Venue>(`/venues/${id}`, data)
  },

  // DELETE /venues/{id} - Suppression (Admin)
  async deleteVenue(id: string): Promise<void> {
    return apiClient.delete<void>(`/venues/${id}`)
  },
}
