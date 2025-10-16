import type { Venue } from './Venue'
import type { Category } from './Category'
import type { User } from './User'

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'

export interface TicketCategory {
  id: string
  eventId: string
  name: string
  price: number
  totalStock: number
  availableStock: number
  description?: string
}

export interface Event {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  status: EventStatus
  imageUrl?: string
  venue: Venue
  category: Category
  organizer: User
  ticketCategories: TicketCategory[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateEventDto {
  title: string
  description: string
  startDate: Date
  endDate: Date
  imageUrl?: string
  venueId: string
  categoryId: string
  ticketCategories: {
    name: string
    price: number
    totalStock: number
    description?: string
  }[]
}

export interface UpdateEventDto {
  title?: string
  description?: string
  startDate?: Date
  endDate?: Date
  status?: EventStatus
  imageUrl?: string
  venueId?: string
  categoryId?: string
}

export interface EventFilters {
  search?: string
  categoryId?: string
  venueId?: string
  city?: string
  startDate?: Date
  endDate?: Date
  minPrice?: number
  maxPrice?: number
  status?: EventStatus
}
