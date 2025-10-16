export interface Venue {
  id: string
  name: string
  address: string
  city: string
  postalCode: string
  country: string
  capacity: number
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateVenueDto {
  name: string
  address: string
  city: string
  postalCode: string
  country: string
  capacity: number
  description?: string
}

export interface UpdateVenueDto {
  name?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  capacity?: number
  description?: string
}
