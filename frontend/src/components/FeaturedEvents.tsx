import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  // CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, ArrowUpRight } from 'lucide-react'
import { eventService } from '@/services/event.service'
import type { Event } from '@/types/Event'

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function FeaturedEvents() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let canceled = false
    const fetchFeaturedEvents = async () => {
      setLoading(true)
      try {
        const data = await eventService.getEvents({ status: 'PUBLISHED' })
        if (canceled) {
          return
        }
        const sorted = data
          .filter((event) => event.status === 'PUBLISHED')
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          )
          .slice(0, 4)
        setFeaturedEvents(sorted)
      } catch (error) {
        if (!canceled) {
          console.error(
            'Erreur lors du chargement des événements en vedette:',
            error
          )
        }
      } finally {
        if (!canceled) {
          setLoading(false)
        }
      }
    }

    fetchFeaturedEvents()

    return () => {
      canceled = true
    }
  }, [])

  const renderCard = (event: Event) => {
    // const availableTickets = event.ticketCategories.reduce(
    //   (sum, category) => sum + (category.availableStock || 0),
    //   0
    // )
    const priceList = event.ticketCategories.map((category) => category.price)
    const minPrice = priceList.length > 0 ? Math.min(...priceList) : 0
    return (
      <Card
        key={event.id}
        className="group overflow-hidden transition-all hover:shadow-xl"
      >
        <div className="bg-gradient-to-br from-primary/15 to-primary/5 aspect-[292/194]">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-5xl">
              🎟️
            </div>
          )}
        </div>
        <CardHeader className="">
          <div className="flex items-center justify-between">
            {event.category ? (
              <Badge variant="secondary" className="text-xs" asChild>
                <Link
                  to={`/events?categoryIds=${event.category.id}`}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  {event.category.name}
                </Link>
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Sans catégorie
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {event.venue?.city || 'Lieu à définir'}
            </Badge>
          </div>
          <CardTitle className="line-clamp-2 text-base transition-colors group-hover:text-primary sm:text-lg">
            {event.title}
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <Calendar className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
            <span>{formatDate(event.startDate)}</span>
          </div>
        </CardHeader>
        {/* <CardContent className="space-y-2 p-4 pt-0 sm:space-y-3 sm:p-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <MapPin className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
            <span className="truncate">
              {event.venue?.name || 'Lieu à annoncer'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <Users className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
            <span>
              {availableTickets.toLocaleString('fr-FR')} places disponibles
            </span>
          </div>
        </CardContent> */}
        <CardFooter className="flex items-end justify-between p-4 pt-0 sm:p-6">
          <div>
            <div className="text-xs text-muted-foreground sm:text-sm">
              À partir de
            </div>
            <div className="text-xl font-bold text-primary sm:text-2xl">
              {formatPrice(minPrice)}
            </div>
          </div>
          <Button asChild size="sm" className="text-xs sm:text-sm">
            <Link to="/events">Réserver</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <section className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">Récents événements</h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Sélection dynamique des prochains événements publiés
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="self-start text-sm sm:self-auto"
        >
          <Link to="/events">
            <ArrowUpRight className="h-4 w-4" />
            Voir tout
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
          Chargement des événements...
        </div>
      ) : featuredEvents.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
          Aucun événement disponible pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {featuredEvents.map((event) => renderCard(event))}
        </div>
      )}
    </section>
  )
}
