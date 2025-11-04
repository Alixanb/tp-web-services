import { useState, useEffect } from 'react'
import { TicketCard } from '@/components/TicketCard'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Ticket } from '@/types/Ticket'

export function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    setLoading(true)
    try {
      // Récupérer tous les tickets des commandes de l'utilisateur
      const { orderService } = await import('@/services/order.service')
      const { authService } = await import('@/services/auth.service')

      const currentUser = authService.getCurrentUser()
      if (currentUser) {
        const orders = await orderService.getUserOrders(currentUser.id)
        const allTickets = orders.flatMap((order) => order.tickets)
        setTickets(allTickets)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des billets:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Mes billets</h1>
          <p className="text-muted-foreground mt-2">
            Tous vos billets en un seul endroit
          </p>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : tickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onViewQR={setSelectedTicket}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Vous n'avez pas encore de billets.
            </p>
          </div>
        )}
      </div>

      {/* QR Code Dialog */}
      <Dialog
        open={!!selectedTicket}
        onOpenChange={() => setSelectedTicket(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code du billet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTicket && (
              <>
                <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                  {/* TODO: Afficher le vrai QR Code */}
                  <div className="text-center">
                    <div className="w-48 h-48 bg-muted flex items-center justify-center rounded">
                      QR Code
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {selectedTicket.qrCode}
                    </p>
                  </div>
                </div>
                <div className="text-sm space-y-2">
                  <p>
                    <strong>Événement:</strong> {selectedTicket.event.title}
                  </p>
                  <p>
                    <strong>Catégorie:</strong>{' '}
                    {selectedTicket.ticketCategoryName}
                  </p>
                  {selectedTicket.seatNumber && (
                    <p>
                      <strong>Place:</strong> {selectedTicket.seatNumber}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
