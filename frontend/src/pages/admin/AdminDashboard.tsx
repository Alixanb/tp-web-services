import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/ui/loader'
import { ApiError } from '@/lib/api-client'
import { eventService } from '@/services/event.service'
import { orderService } from '@/services/order.service'
import { userService } from '@/services/user.service'
import { venueService } from '@/services/venue.service'
import type { Event, EventStatus, UpdateEventDto } from '@/types/Event'
import type { Order } from '@/types/Order'
import type { User } from '@/types/User'
import type { Venue } from '@/types/Venue'
import {
  ArrowUpRight,
  Calendar,
  Edit,
  MapPin,
  RefreshCw,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [updatingEventId, setUpdatingEventId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'DRAFT' as EventStatus,
  })

  const retrieveDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [fetchedUsers, fetchedEvents, fetchedVenues, fetchedOrders] =
        await Promise.all([
          userService.getAllUsers(),
          eventService.getEvents({ includeAllStatuses: true }),
          venueService.getVenues(),
          orderService.getAllOrders(),
        ])
      setUsers(fetchedUsers)
      setEvents(fetchedEvents)
      setVenues(fetchedVenues)
      setOrders(fetchedOrders)
      setHasLoaded(true)
    } catch (err) {
      console.error('Erreur lors du chargement du tableau de bord:', err)
      setError('Impossible de charger les données du tableau de bord.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    retrieveDashboard()
  }, [retrieveDashboard])

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
    [orders]
  )

  const publishedEvents = useMemo(
    () => events.filter((eventItem) => eventItem.status === 'PUBLISHED'),
    [events]
  )

  const upcomingEvents = useMemo(() => {
    return [...events]
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
      .slice(0, 5)
  }, [events])

  const recentUsers = useMemo(() => {
    return [...users]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
  }, [users])

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      )
      .slice(0, 5)
  }, [orders])

  const stats = [
    {
      label: 'Utilisateurs',
      value: users.length.toLocaleString('fr-FR'),
      icon: Users,
    },
    {
      label: 'Événements publiés',
      value: publishedEvents.length.toLocaleString('fr-FR'),
      icon: Calendar,
    },
    {
      label: 'Lieux actifs',
      value: venues.length.toLocaleString('fr-FR'),
      icon: MapPin,
    },
    {
      label: 'Revenus cumulés',
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
    },
  ]

  const eventStatusOptions: EventStatus[] = [
    'DRAFT',
    'PUBLISHED',
    'CANCELLED',
    'COMPLETED',
  ]

  const handleEventStatusChange = async (
    eventId: string,
    status: EventStatus
  ) => {
    setUpdatingEventId(eventId)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        return
      }

      const updated = await eventService.updateEvent(eventId, { status })
      setEvents((current) =>
        current.map((eventItem) =>
          eventItem.id === eventId ? { ...eventItem, status: updated.status } : eventItem
        )
      )
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut de l'événement:", err)
      if (err instanceof ApiError && err.statusCode === 401) {
        alert('Votre session a expiré. Veuillez vous reconnecter.')
      }
    } finally {
      setUpdatingEventId(null)
    }
  }

  const totalVenuesCapacity = useMemo(
    () => venues.reduce((sum, venue) => sum + (venue.capacity || 0), 0),
    [venues]
  )

  const formatEventCapacity = (eventItem: Event) => {
    const totalStock = eventItem.ticketCategories.reduce(
      (sum, category) => sum + (category.totalStock || 0),
      0
    )
    const remainingStock = eventItem.ticketCategories.reduce(
      (sum, category) => sum + (category.availableStock || 0),
      0
    )
    return {
      totalStock,
      remainingStock,
      soldStock: totalStock - remainingStock,
    }
  }

  const toDateInputValue = (value?: Date | string) => {
    if (!value) {
      return ''
    }
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      return ''
    }
    return parsed.toISOString().slice(0, 16)
  }

  const openEditEvent = (eventItem: Event) => {
    setSelectedEvent(eventItem)
    setEditError(null)
    setEditForm({
      title: eventItem.title || '',
      description: eventItem.description || '',
      startDate: toDateInputValue(eventItem.startDate),
      endDate: toDateInputValue(eventItem.endDate),
      status: eventItem.status,
    })
    setEditDialogOpen(true)
  }

  const handleEditFieldChange = (
    field: 'title' | 'description' | 'startDate' | 'endDate' | 'status',
    value: string
  ) => {
    setEditForm((current) => ({ ...current, [field]: value }))
  }

  const submitEditForm = async () => {
    if (!selectedEvent) {
      return
    }
    setSavingEdit(true)
    setEditError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setEditError('Vous devez être connecté pour modifier un événement.')
        return
      }

      const payload: Partial<UpdateEventDto> = {
        title: editForm.title,
        description: editForm.description,
        status: editForm.status,
      }
      if (editForm.startDate) {
        payload.startDate = new Date(editForm.startDate).toISOString()
      }
      if (editForm.endDate) {
        payload.endDate = new Date(editForm.endDate).toISOString()
      }
      const updated = await eventService.updateEvent(selectedEvent.id, payload)
      setEvents((current) =>
        current.map((eventItem) =>
          eventItem.id === selectedEvent.id ? { ...eventItem, ...updated } : eventItem
        )
      )
      handleEditDialogToggle(false)
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'événement:", err)
      if (err instanceof ApiError) {
        if (err.statusCode === 401) {
          setEditError('Votre session a expiré. Veuillez vous reconnecter.')
        } else {
          setEditError(err.message || 'Mise à jour impossible.')
        }
      } else {
        setEditError('Mise à jour impossible.')
      }
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    const targetedEvent = events.find((eventItem) => eventItem.id === eventId)
    if (!targetedEvent) {
      return
    }
    const confirmation = window.confirm(
      `Supprimer définitivement « ${targetedEvent.title} » ?`
    )
    if (!confirmation) {
      return
    }
    setDeletingEventId(eventId)
    try {
      await eventService.deleteEvent(eventId)
      setEvents((current) => current.filter((eventItem) => eventItem.id !== eventId))
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'événement:', err)
    } finally {
      setDeletingEventId(null)
    }
  }

  const handleEditDialogToggle = (open: boolean) => {
    setEditDialogOpen(open)
    if (!open) {
      setSelectedEvent(null)
      setEditError(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Tableau de bord Admin</h1>
            <p className="text-muted-foreground mt-2">
              Vue consolidée des performances de la plateforme
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={retrieveDashboard}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = '/events'
              }}
            >
              <ArrowUpRight className="h-4 w-4" />
              Explorer les événements
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="py-4 text-sm text-destructive">
              {error}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading && !hasLoaded ? '—' : stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Événements à venir</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Gestion des statuts et disponibilités en direct
                </p>
              </div>
              <Badge variant="secondary">
                {events.length.toLocaleString('fr-FR')} événements
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading && !hasLoaded ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Chargement...
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Aucun événement enregistré.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="py-3 pr-4 font-medium">Événement</th>
                        <th className="py-3 pr-4 font-medium">Lieu</th>
                        <th className="py-3 pr-4 font-medium">Billets</th>
                        <th className="py-3 pr-4 font-medium">Statut</th>
                        <th className="py-3 pr-4 font-medium w-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {upcomingEvents.map((eventItem) => {
                        const { totalStock, remainingStock, soldStock } =
                          formatEventCapacity(eventItem)
                        return (
                          <tr key={eventItem.id} className="align-top">
                            <td className="py-3 pr-4">
                              <div className="font-medium">{eventItem.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatDateTime(eventItem.startDate)}
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <div className="font-medium">
                                {eventItem.venue?.name || 'N/A'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {eventItem.venue?.city}
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <div className="font-medium">
                                {soldStock.toLocaleString('fr-FR')} vendus
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {remainingStock.toLocaleString('fr-FR')} restants sur{' '}
                                {totalStock.toLocaleString('fr-FR')}
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <select
                                value={eventItem.status}
                                onChange={(evt) =>
                                  handleEventStatusChange(
                                    eventItem.id,
                                    evt.target.value as EventStatus
                                  )
                                }
                                disabled={updatingEventId === eventItem.id}
                                className="w-full min-w-[140px] rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                              >
                                {eventStatusOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 pr-4">
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditEvent(eventItem)}
                                >
                                  <Edit />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteEvent(eventItem.id)}
                                  disabled={deletingEventId === eventItem.id}
                                >
                                  {deletingEventId === eventItem.id
                                    ? <Loader size="small" variant="white" />
                                    : <Trash2 />}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Dernières commandes</CardTitle>
                <Badge variant="outline">
                  {formatCurrency(totalRevenue)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading && !hasLoaded ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    Chargement...
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    Aucune commande pour le moment.
                  </div>
                ) : (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-lg border border-border/80 p-3"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{order.user?.email}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(order.orderDate)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {order.tickets?.length || 0} billets
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(order.totalAmount || 0)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Nouveaux utilisateurs</CardTitle>
                <Badge variant="outline">
                  Capacité totale {totalVenuesCapacity.toLocaleString('fr-FR')}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading && !hasLoaded ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    Chargement...
                  </div>
                ) : recentUsers.length === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    Aucun utilisateur récent.
                  </div>
                ) : (
                  recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="rounded-lg border border-border/80 p-3"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {user.firstName} {user.lastName}
                        </span>
                        <Badge variant="secondary">{user.role}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Inscrit le {formatDateTime(user.createdAt)}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={handleEditDialogToggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'événement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editError && <p className="text-sm text-destructive">{editError}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="event-title">
                Titre
              </label>
              <Input
                id="event-title"
                value={editForm.title}
                onChange={(evt) => handleEditFieldChange('title', evt.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="event-description">
                Description
              </label>
              <textarea
                id="event-description"
                value={editForm.description}
                onChange={(evt) => handleEditFieldChange('description', evt.target.value)}
                className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="event-start">
                  Date de début
                </label>
                <Input
                  id="event-start"
                  type="datetime-local"
                  value={editForm.startDate}
                  onChange={(evt) => handleEditFieldChange('startDate', evt.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="event-end">
                  Date de fin
                </label>
                <Input
                  id="event-end"
                  type="datetime-local"
                  value={editForm.endDate}
                  onChange={(evt) => handleEditFieldChange('endDate', evt.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="event-status">
                Statut
              </label>
              <select
                id="event-status"
                value={editForm.status}
                onChange={(evt) =>
                  handleEditFieldChange('status', evt.target.value as EventStatus)
                }
                className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {eventStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleEditDialogToggle(false)}
              disabled={savingEdit}
            >
              Annuler
            </Button>
            <Button
              onClick={submitEditForm}
              disabled={savingEdit || editForm.title.trim().length === 0}
            >
              {savingEdit ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
