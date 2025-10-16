import type { SalesReport, VenueReport, ReportFilters } from '@/types/Report'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Ces services seront implémentés via SOAP
export const reportService = {
  // SOAP: generateSaleReport - Rapport de vente
  async getSalesReport(filters: ReportFilters): Promise<SalesReport> {
    // TODO: Implémenter avec SOAP
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
