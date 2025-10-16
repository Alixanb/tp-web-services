export interface SalesReport {
  eventId: string
  eventTitle: string
  totalRevenue: number
  ticketsSold: number
  ticketsByCategory: {
    categoryName: string
    sold: number
    revenue: number
  }[]
  reportDate: Date
}

export interface VenueReport {
  venueId: string
  venueName: string
  totalEvents: number
  totalRevenue: number
  averageAttendance: number
}

export interface ReportFilters {
  eventId?: string
  startDate?: Date
  endDate?: Date
  venueId?: string
  categoryId?: string
}
