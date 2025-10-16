import { useState } from 'react'
import { EventCard } from '@/components/EventCard'
import { SearchFilters } from '@/components/SearchFilters'
import type { Event, EventFilters } from '@/types/Event'

export function EventsPage() {
  const [filters, setFilters] = useState<EventFilters>({})
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    try {
      // TODO: Appeler l'API eventService.getEvents(filters)
      console.log('Recherche avec filtres:', filters)
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Découvrez les événements
          </h1>
          <p className="text-muted-foreground mt-2">
            Trouvez et réservez vos billets pour les meilleurs événements
          </p>
        </div>

        {/* Filters */}
        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
        />

        {/* Results */}
        <div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucun événement trouvé. Essayez de modifier vos filtres.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
