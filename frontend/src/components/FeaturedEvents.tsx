import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Star } from 'lucide-react'

export function FeaturedEvents() {
  const featuredEvents = [
    {
      id: 1,
      title: 'Concert de Jazz en Plein Air',
      date: '15 Nov 2025',
      location: 'Paris, France',
      price: '35€',
      category: 'Musique',
      image: '🎵',
      available: 150,
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Conférence Tech Summit 2025',
      date: '20 Nov 2025',
      location: 'Lyon, France',
      price: '120€',
      category: 'Business',
      image: '💼',
      available: 45,
      rating: 4.9,
    },
    {
      id: 3,
      title: 'Festival Gastronomique',
      date: '25 Nov 2025',
      location: 'Bordeaux, France',
      price: '25€',
      category: 'Festival',
      image: '🍷',
      available: 200,
      rating: 4.7,
    },
    {
      id: 4,
      title: 'Soirée Électro Night',
      date: '30 Nov 2025',
      location: 'Marseille, France',
      price: '45€',
      category: 'Musique',
      image: '🎧',
      available: 80,
      rating: 4.6,
    },
  ]

  return (
    <section className="container mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Récents événements</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Les événements les plus attendus du moment
          </p>
        </div>
        <Button variant="outline" className="self-start sm:self-auto text-sm">
          Voir tout
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {featuredEvents.map((event) => (
          <Card
            key={event.id}
            className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-5xl sm:text-6xl group-hover:scale-110 transition-transform">
              {event.image}
            </div>
            <CardHeader className="space-y-2 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {event.category}
                </Badge>
                <div className="flex items-center gap-1 text-xs sm:text-sm">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-medium">{event.rating}</span>
                </div>
              </div>
              <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-base sm:text-lg">
                {event.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6 pt-0">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{event.available} places disponibles</span>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 sm:p-6 pt-0">
              <div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  À partir de
                </div>
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  {event.price}
                </div>
              </div>
              <Button size="sm" className="text-xs sm:text-sm">
                Réserver
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
