import type { SalesReport, VenueReport, ReportFilters } from '@/types/Report'
import { mockApi } from '@/lib/mock-api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const USE_MOCK = true // Mettre à false quand le SOAP sera prêt

// Ces services seront implémentés via SOAP
export const reportService = {
  // SOAP: generateSaleReport - Rapport de vente
  async getSalesReport(filters: ReportFilters): Promise<SalesReport> {
    if (USE_MOCK && filters.eventId) {
      return mockApi.getSalesReport(filters.eventId)
    }
    // TODO: Implémenter avec SOAP réel
    throw new Error('Not implemented - SOAP service')
  },

  // SOAP: getVenueCapacity & reporting
  async getVenueReport(venueId: string): Promise<VenueReport> {
    // TODO: Implémenter avec SOAP
    throw new Error('Not implemented - SOAP service')
  },

  // Export report as PDF/CSV
  async exportReport(reportId: string, format: 'pdf' | 'csv'): Promise<Blob> {
    // TODO: Implémenter
    throw new Error('Not implemented')
  },
}
