import type { ReportFilters, SalesReport, VenueReport } from "@/types/Report";

// Ces services seront implémentés via SOAP
export const reportService = {
  // SOAP: generateSaleReport - Rapport de vente
  async getSalesReport(filters: ReportFilters): Promise<SalesReport> {
    // TODO: Implémenter avec SOAP réel
    throw new Error("Not implemented - SOAP service");
  },

  // SOAP: getVenueCapacity & reporting
  async getVenueReport(venueId: string): Promise<VenueReport> {
    // TODO: Implémenter avec SOAP
    throw new Error("Not implemented - SOAP service");
  },

  // Export report as PDF/CSV
  async exportReport(reportId: string, format: "pdf" | "csv"): Promise<Blob> {
    // TODO: Implémenter
    throw new Error("Not implemented");
  },
};
