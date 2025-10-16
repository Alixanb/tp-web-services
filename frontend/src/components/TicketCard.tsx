import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, QrCode, Ticket as TicketIcon } from 'lucide-react'
import type { Ticket } from '@/types/Ticket'

interface TicketCardProps {
  ticket: Ticket
  onViewQR?: (ticket: Ticket) => void
}

export function TicketCard({ ticket, onViewQR }: TicketCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const statusColors = {
    ACTIVE: 'default',
    USED: 'secondary',
    TRANSFERRED: 'outline',
    CANCELLED: 'destructive',
  } as const

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{ticket.event.title}</CardTitle>
            <Badge variant={statusColors[ticket.status]}>{ticket.status}</Badge>
          </div>
          <TicketIcon className="h-8 w-8 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div>
          <div className="text-sm text-muted-foreground">Catégorie</div>
          <div className="font-medium">{ticket.ticketCategoryName}</div>
        </div>

        {ticket.seatNumber && (
          <div>
            <div className="text-sm text-muted-foreground">Place</div>
            <div className="font-medium">{ticket.seatNumber}</div>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(ticket.event.startDate)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {ticket.event.venue.name}, {ticket.event.venue.city}
          </span>
        </div>

        <div className="pt-2">
          <div className="text-lg font-bold text-primary">{ticket.price}€</div>
        </div>

        {ticket.status === 'ACTIVE' && (
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => onViewQR?.(ticket)}
          >
            <QrCode className="h-4 w-4 mr-2" />
            Afficher le QR Code
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
