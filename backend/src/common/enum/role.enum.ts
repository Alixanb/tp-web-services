export enum UserRole {
  CLIENT = 'CLIENT',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  RESERVED = 'RESERVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum TicketStatus {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  TRANSFERRED = 'TRANSFERRED',
  CANCELLED = 'CANCELLED',
}
