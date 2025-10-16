import type { Venue, CreateVenueDto, UpdateVenueDto } from '@/types/Venue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const venueService = {
  // GET /venues - Liste des lieux
  async getVenues(): Promise<Venue[]> {
    // TODO: Implémenter avec l'API
    throw new Error('Not implemented')
  },

  // GET /venues/{id} - Détails d'un lieu
  async getVenueById(id: string): Promise<Venue> {
    // TODO: Implémenter avec l'API
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
