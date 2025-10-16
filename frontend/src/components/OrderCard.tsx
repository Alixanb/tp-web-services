import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Receipt, Ticket } from 'lucide-react'
import type { Order } from '@/types/Order'

interface OrderCardProps {
  order: Order
  onViewDetails?: (order: Order) => void
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const statusColors = {
    PENDING: 'secondary',
    RESERVED: 'outline',
    PAID: 'default',
    CANCELLED: 'destructive',
    REFUNDED: 'outline',
  } as const

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          <CardTitle className="text-sm font-medium">
            Commande #{order.id.slice(0, 8)}
          </CardTitle>
        </div>
        <Badge variant={statusColors[order.status]}>{order.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(order.orderDate)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Ticket className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {order.tickets.length} billet{order.tickets.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">
              {order.totalAmount}€
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => onViewDetails?.(order)}
        >
          Voir les détails
        </Button>
      </CardContent>
    </Card>
  )
}
