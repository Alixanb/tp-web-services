import type { Venue, CreateVenueDto, UpdateVenueDto } from '@/types/Venue'
import { mockApi } from '@/lib/mock-api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const USE_MOCK = true // Mettre à false quand l'API sera prête

export const venueService = {
  // GET /venues - Liste des lieux
  async getVenues(): Promise<Venue[]> {
    if (USE_MOCK) return mockApi.getVenues()
    // TODO: Implémenter avec l'API réelle
    throw new Error('Not implemented')
  },

  // GET /venues/{id} - Détails d'un lieu
  async getVenueById(id: string): Promise<Venue> {
    if (USE_MOCK) return mockApi.getVenueById(id)
    // TODO: Implémenter avec l'API réelle
    throw new Error('Not implemented')
  },

  // POST /venues - Création (Admin)
  async createVenue(data: CreateVenueDto): Promise<Venue> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // PUT /venues/{id} - Modification (Admin)
  async updateVenue(id: string, data: UpdateVenueDto): Promise<Venue> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // DELETE /venues/{id} - Suppression (Admin)
  async deleteVenue(id: string): Promise<void> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },
}
