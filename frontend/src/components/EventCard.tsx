import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Event } from '@/types/Event'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

interface EventCardProps {
  event: Event
  onSelect?: (event: Event) => void
}

export function EventCard({ event }: EventCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const minPrice = Math.min(...event.ticketCategories.map((tc) => tc.price))
  const availableTickets = event.ticketCategories.reduce(
    (sum, tc) => sum + tc.availableStock,
    0
  )

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group pb-6">
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-5xl sm:text-6xl overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 duration-300 transition-transform"
          />
        ) : (
          <span className="text-6xl">🎟️</span>
        )}
      </div>
      <CardHeader className="space-y-2 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs" asChild>
            <Link
              to={`/events?categoryIds=${event.category.id}`}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {event.category.name}
            </Link>
          </Badge>
        </div>
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-base sm:text-lg">
          {event.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6 pt-0">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span>{formatDate(event.startDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="truncate">
            {event.venue.name}, {event.venue.city}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span>{availableTickets} places disponibles</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 sm:p-6 pt-0">
        <div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            À partir de
          </div>
          <div className="text-xl sm:text-2xl font-bold text-primary">
            {minPrice}€
          </div>
        </div>
        <Button size="sm" asChild>
          <Link to={`/events/${event.id}`}>Voir détails</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
