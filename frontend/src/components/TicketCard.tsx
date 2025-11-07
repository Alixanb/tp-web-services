import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Ticket } from '@/types/Ticket'
import { Calendar, MapPin, QrCode, Ticket as TicketIcon } from 'lucide-react'

interface TicketCardProps {
  ticket: Ticket
  onViewQR?: (ticket: Ticket) => void
}

export function TicketCard({ ticket, onViewQR }: TicketCardProps) {
  const statusColors = {
    ACTIVE: 'default',
    USED: 'secondary',
    TRANSFERRED: 'outline',
    CANCELLED: 'destructive',
  } as const

  return (
    <Card className="overflow-hidden flex flex-col h-full pb-6">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4 pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 line-clamp-2">
              {ticket.event?.title || 'Événement inconnu'}
            </CardTitle>
            <Badge variant={statusColors[ticket.status]}>{ticket.status}</Badge>
          </div>
          <TicketIcon className="h-8 w-8 text-primary flex-shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
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
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>
              {ticket.event?.startDate
                ? new Date(ticket.event.startDate).toLocaleDateString('fr-FR')
                : 'Date à confirmer'}
            </span>
          </div>

          {ticket.event?.venue ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {ticket.event.venue.name}
                {ticket.event.venue.city ? `, ${ticket.event.venue.city}` : ''}
              </span>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">
              Lieu non disponible
            </div>
          )}
        </div>

        <div className="space-y-3 mt-4">
          <div className="pt-2 border-t">
            <div className="text-lg font-bold text-primary">
              {ticket.price}€
            </div>
          </div>

          {ticket.status === 'ACTIVE' ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onViewQR?.(ticket)}
            >
              <QrCode className="h-4 w-4 mr-2" />
              Afficher le QR Code
            </Button>
          ) : (
            <div className="h-10" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
