import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { eventService } from '@/services/event.service'
import type { Event } from '@/types/Event'
import { ArrowLeft, Calendar, MapPin, Ticket } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const loadEvent = async () => {
      try {
        const data = await eventService.getEventById(id)
        setEvent(data)
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [id])

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

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Événement non trouvé</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
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

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" asChild>
              <Link to={`/events?categoryIds=${event.category.id}`}>
                {event.category.name}
              </Link>
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>

          <div className="flex flex-wrap gap-4 text-muted-foreground">
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

          <p className="text-lg text-muted-foreground whitespace-pre-line">
            {event.description}
          </p>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold">Catégories de billets</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-6 py-3 text-left text-sm font-semibold">Catégorie</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold">Prix</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">Disponibilité</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">Stock total</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.ticketCategories.map((category) => {
                      const isAvailable = category.availableStock > 0
                      return (
                        <tr key={category.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium">{category.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-muted-foreground max-w-md">
                              {category.description || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-lg font-bold text-primary">
                              {category.price}€
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge variant={isAvailable ? 'default' : 'secondary'}>
                              {isAvailable
                                ? `${category.availableStock} disponibles`
                                : 'Épuisé'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm text-muted-foreground">
                              {category.totalStock}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Button
                              size="sm"
                              disabled={!isAvailable}
                              onClick={() => navigate(`/reserve/${category.id}`)}
                            >
                              <Ticket className="h-4 w-4 mr-2" />
                              {isAvailable ? 'Réserver' : 'Épuisé'}
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


