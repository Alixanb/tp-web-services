import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Star } from 'lucide-react'

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
      <div className="text-center space-y-4 sm:space-y-6 max-w-3xl mx-auto">
        <Badge className="mb-2 text-xs sm:text-sm" variant="secondary">
          <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
          Plateforme #1 de Billetterie en Ligne
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight px-2">
          Découvrez les événements
          <span className="block text-primary mt-2">qui vous passionnent</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">
          Des milliers d'événements à portée de main. Concerts, festivals,
          conférences et bien plus encore.
        </p>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mt-6 sm:mt-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher un événement, artiste, lieu..."
              className="pl-10 h-11 sm:h-12 text-sm"
            />
          </div>
          <Button
            size="lg"
            className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
          >
            Rechercher
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 pt-8 sm:pt-10 md:pt-12">
          <div className="space-y-1 sm:space-y-2">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              1.2M+
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Billets vendus
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              5K+
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Événements
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              500+
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Organisateurs
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
