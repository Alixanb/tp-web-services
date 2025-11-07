import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { eventService } from '@/services/event.service'
import { orderService } from '@/services/order.service'
import type { Event, TicketCategory } from '@/types/Event'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  MapPin,
  Ticket,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

export function TicketReservationPage() {
  const { ticketCategoryId } = useParams<{ ticketCategoryId: string }>()
  const navigate = useNavigate()
  const [ticketCategory, setTicketCategory] = useState<TicketCategory | null>(
    null
  )
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [reserving, setReserving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!ticketCategoryId) return

    const loadData = async () => {
      try {
        const events = await eventService.getEvents()
        const foundEvent = events.find((e) =>
          e.ticketCategories.some((tc) => tc.id === ticketCategoryId)
        )

        if (foundEvent) {
          const normalizedEvent: Event = {
            ...foundEvent,
            ticketCategories: foundEvent.ticketCategories.map((tc) => ({
              ...tc,
              price: Number(tc.price ?? 0),
              totalStock: Number(tc.totalStock ?? 0),
              availableStock: Number(tc.availableStock ?? 0),
            })),
          }
          setEvent(normalizedEvent)
          const category = normalizedEvent.ticketCategories.find(
            (tc) => tc.id === ticketCategoryId
          )
          setTicketCategory(
            category
              ? {
                ...category,
                price: Number(category.price ?? 0),
                totalStock: Number(category.totalStock ?? 0),
                availableStock: Number(category.availableStock ?? 0),
              }
              : null
          )
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [ticketCategoryId])

  const handleReserve = async () => {
    if (!ticketCategory) return

    setReserving(true)
    try {
      const priceValue = Number(ticketCategory.price)
      if (!Number.isFinite(priceValue) || priceValue < 0) {
        throw new Error('Prix de billet invalide')
      }

      await orderService.createOrder({
        items: [
          {
            ticketCategoryId: ticketCategory.id,
            quantity: 1,
            price: priceValue,
          },
        ],
      })
      setSuccess(true)
      setTimeout(() => {
        navigate('/my-orders')
      }, 2000)
    } catch (error: unknown) {
      console.error('Erreur lors de la réservation:', error)
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Erreur lors de la réservation. Veuillez réessayer.'
      alert(errorMessage)
    } finally {
      setReserving(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  if (!event || !ticketCategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Catégorie de billet non trouvée</div>
      </div>
    )
  }

  const isAvailable = ticketCategory.availableStock > 0

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl">
                🎟️
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" asChild>
                <Link to={`/events?categoryIds=${event.category.id}`}>
                  {event.category.name}
                </Link>
              </Badge>
            </div>

            <h1 className="text-3xl font-bold">{event.title}</h1>

            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {event.venue.name}, {event.venue.city}
                </span>
              </div>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  {ticketCategory.name}
                </h2>
                {ticketCategory.description && (
                  <p className="text-muted-foreground">
                    {ticketCategory.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 pr-4 text-base font-medium">Prix unitaire</td>
                      <td className="py-3 text-right">
                        <span className="text-2xl font-bold text-primary">
                          {ticketCategory.price}€
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pr-4 text-base font-medium">Quantité</td>
                      <td className="py-3 text-right">
                        <span className="text-base font-medium">1</span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pr-4 text-base font-medium">Disponibilité</td>
                      <td className="py-3 text-right">
                        <Badge variant={isAvailable ? 'default' : 'secondary'} className="text-sm">
                          {isAvailable
                            ? `${ticketCategory.availableStock} places disponibles`
                            : 'Épuisé'}
                        </Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pr-4 text-base font-medium">Stock total</td>
                      <td className="py-3 text-right">
                        <span className="text-base font-medium text-muted-foreground">
                          {ticketCategory.totalStock} places
                        </span>
                      </td>
                    </tr>
                    <tr className="border-t-2 border-primary">
                      <td className="py-4 pr-4 text-lg font-bold">Total</td>
                      <td className="py-4 text-right">
                        <span className="text-2xl font-bold text-primary">
                          {ticketCategory.price}€
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {success ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">
                      Réservation effectuée avec succès !
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Redirection vers vos commandes...
                  </p>
                </div>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!isAvailable || reserving}
                  onClick={handleReserve}
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  {reserving ? 'Réservation en cours...' : 'Réserver'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

