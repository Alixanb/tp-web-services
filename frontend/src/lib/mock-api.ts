import mockData from '@/data/mock-data.json'
import type { Event, EventFilters } from '@/types/Event'
import type { Order } from '@/types/Order'
import type { Ticket } from '@/types/Ticket'
import type { Venue } from '@/types/Venue'
import type { Category } from '@/types/Category'
import type { User, LoginDto, AuthResponse, CreateUserDto } from '@/types/User'
import type { SalesReport } from '@/types/Report'

// Simuler un délai réseau
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms))

// Mock API pour simuler le backend
export const mockApi = {
  // ============ AUTH ============
  async login(credentials: LoginDto): Promise<AuthResponse> {
    await delay()

    // Simuler l'authentification
    const user = mockData.users.find((u) => u.email === credentials.email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Générer un faux token
    const token = `mock_token_${user.id}_${Date.now()}`

    return {
      user: user as User,
      token,
    }
  },

  async register(data: CreateUserDto): Promise<AuthResponse> {
    await delay()

    // Vérifier si email existe
    const exists = mockData.users.some((u) => u.email === data.email)
    if (exists) {
      throw new Error('Email already exists')
    }

    // Créer un nouvel utilisateur
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || 'CLIENT',
      phoneNumber: data.phoneNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const token = `mock_token_${newUser.id}_${Date.now()}`

    return { user: newUser, token }
  },

  // ============ EVENTS ============
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    await delay()

    let events = [...mockData.events] as Event[]

    // Appliquer les filtres
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(search) ||
          e.description.toLowerCase().includes(search)
      )
    }

    if (filters?.categoryId) {
      events = events.filter((e) => e.category.id === filters.categoryId)
    }

    if (filters?.city) {
      events = events.filter(
        (e) => e.venue.city.toLowerCase() === filters.city?.toLowerCase()
      )
    }

    if (filters?.minPrice) {
      events = events.filter((e) =>
        e.ticketCategories.some((tc) => tc.price >= filters.minPrice!)
      )
    }

    if (filters?.maxPrice) {
      events = events.filter((e) =>
        e.ticketCategories.some((tc) => tc.price <= filters.maxPrice!)
      )
    }

    return events
  },

  async getEventById(id: string): Promise<Event> {
    await delay()

    const event = mockData.events.find((e) => e.id === id)
    if (!event) {
      throw new Error('Event not found')
    }

    return event as Event
  },

  // ============ ORDERS ============
  async createOrder(items: any[]): Promise<Order> {
    await delay()

    // Simuler la création d'une commande
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      user: mockData.users[0] as User,
      orderDate: new Date(),
      status: 'PAID',
      totalAmount: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      tickets: items.map((item, index) => ({
        id: `ticket-${Date.now()}-${index}`,
        orderId: `order-${Date.now()}`,
        event: mockData.events[0] as Event,
        ticketCategoryName: 'Standard',
        qrCode: `QR_${Date.now()}_${index}`,
        status: 'ACTIVE' as const,
        price: item.price,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return newOrder
  },

  async getOrderById(id: string): Promise<Order> {
    await delay()

    const order = mockData.orders.find((o) => o.id === id)
    if (!order) {
      throw new Error('Order not found')
    }

    return order as Order
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    await delay()
    return mockData.orders as Order[]
  },

  // ============ TICKETS ============
  async getTicketById(id: string): Promise<Ticket> {
    await delay()

    // Chercher dans toutes les commandes
    for (const order of mockData.orders) {
      const ticket = order.tickets.find((t) => t.id === id)
      if (ticket) {
        return ticket as Ticket
      }
    }

    throw new Error('Ticket not found')
  },

  async getOrderTickets(orderId: string): Promise<Ticket[]> {
    await delay()

    const order = mockData.orders.find((o) => o.id === orderId)
    if (!order) {
      throw new Error('Order not found')
    }

    return order.tickets as Ticket[]
  },

  // ============ VENUES ============
  async getVenues(): Promise<Venue[]> {
    await delay()
    return mockData.venues as Venue[]
  },

  async getVenueById(id: string): Promise<Venue> {
    await delay()

    const venue = mockData.venues.find((v) => v.id === id)
    if (!venue) {
      throw new Error('Venue not found')
    }

    return venue as Venue
  },

  // ============ CATEGORIES ============
  async getCategories(): Promise<Category[]> {
    await delay()
    return mockData.categories as Category[]
  },

  async getCategoryById(id: string): Promise<Category> {
    await delay()

    const category = mockData.categories.find((c) => c.id === id)
    if (!category) {
      throw new Error('Category not found')
    }

    return category as Category
  },

  // ============ REPORTS (SOAP) ============
  async getSalesReport(eventId: string): Promise<SalesReport> {
    await delay()

    const report = mockData.salesReports.find((r) => r.eventId === eventId)
    if (!report) {
      // Générer un rapport par défaut
      return {
        eventId,
        eventTitle: 'Event',
        totalRevenue: 0,
        ticketsSold: 0,
        ticketsByCategory: [],
        reportDate: new Date(),
      }
    }

    return report as SalesReport
  },
}
