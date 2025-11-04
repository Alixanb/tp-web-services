import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { venueService } from '@/services/venue.service'
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react'
import type { Venue } from '@/types/Venue'

export function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVenues()
  }, [])

  const loadVenues = async () => {
    setLoading(true)
    try {
      const data = await venueService.getVenues()
      setVenues(data)
    } catch (error) {
      console.error('Erreur lors du chargement des lieux:', error)
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
            <h1 className="text-3xl md:text-4xl font-bold">
              Gestion des lieux
            </h1>
            <p className="text-muted-foreground mt-2">
              Administrez les lieux d'événements
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un lieu
          </Button>
        </div>

        {/* Venues List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : venues.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <Card key={venue.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{venue.name}</CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        {venue.city}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <p>{venue.address}</p>
                    <p>
                      {venue.postalCode} {venue.city}, {venue.country}
                    </p>
                  </div>
                  <div className="text-sm">
                    <strong>Capacité:</strong> {venue.capacity} personnes
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Aucun lieu enregistré.</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter le premier lieu
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
