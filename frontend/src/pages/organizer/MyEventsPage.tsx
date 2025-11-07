import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/components/EventCard'
import { eventService } from '@/services/event.service'
import { Plus } from 'lucide-react'
import type { Event } from '@/types/Event'

export function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMyEvents()
  }, [])

  const loadMyEvents = async () => {
    setLoading(true)
    try {
      // Pour le moment, on charge tous les événements
      // TODO: Filtrer par organizerId quand l'API sera prête
      const data = await eventService.getEvents({ includeAllStatuses: true })
      setEvents(data)
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Mes événements</h1>
            <p className="text-muted-foreground mt-2">
              Gérez vos événements et consultez les statistiques
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Créer un événement
          </Button>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Vous n'avez pas encore créé d'événements.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer votre premier événement
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
