import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Ticket } from 'lucide-react'
import type { Order } from '@/types/Order'

interface OrderCardProps {
  order: Order
  onViewDetails?: (order: Order) => void
}

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

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  // Récupérer l'événement du premier ticket
  const event = order.tickets[0]?.event

  const statusColors = {
    PENDING: 'secondary',
    RESERVED: 'outline',
    PAID: 'default',
    CANCELLED: 'destructive',
    REFUNDED: 'outline',
  } as const

  const statusLabels = {
    PENDING: 'En attente',
    RESERVED: 'Réservé',
    PAID: 'Payé',
    CANCELLED: 'Annulé',
    REFUNDED: 'Remboursé',
  } as const

  if (!event) {
    return null
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-xl">
      <div className="relative bg-gradient-to-br from-primary/15 to-primary/5 aspect-[292/194]">
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
        <div className="absolute top-2 right-2">
          <Badge variant={statusColors[order.status]}>
            {statusLabels[order.status]}
          </Badge>
        </div>
      </div>
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {event.category?.name || 'Sans catégorie'}
          </Badge>
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
      <CardContent className="space-y-2 p-4 pt-0 sm:p-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <Ticket className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
          <span>
            {order.tickets.length} billet{order.tickets.length > 1 ? 's' : ''}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0 sm:p-6">
        <div>
          <div className="text-xs text-muted-foreground sm:text-sm">Total</div>
          <div className="text-xl font-bold text-primary sm:text-2xl">
            {formatPrice(order.totalAmount)}
          </div>
        </div>
        <Button
          asChild={false}
          size="sm"
          className="text-xs sm:text-sm"
          onClick={() => onViewDetails?.(order)}
        >
          Voir détails
        </Button>
      </CardFooter>
    </Card>
  )
}
