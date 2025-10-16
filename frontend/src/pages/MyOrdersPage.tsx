import { useState, useEffect } from 'react'
import { OrderCard } from '@/components/OrderCard'
import type { Order } from '@/types/Order'

export function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      // TODO: Appeler l'API orderService.getUserOrders()
      console.log('Chargement des commandes')
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Mes commandes</h1>
          <p className="text-muted-foreground mt-2">
            Retrouvez l'historique de vos achats
          </p>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Vous n'avez pas encore de commandes.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
