import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Star } from 'lucide-react'
import { eventService } from '@/services/event.service'
import { venueService } from '@/services/venue.service'
import { orderService } from '@/services/order.service'

// Fonction de formatage de devise
function formatCurrency(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

// Hook pour animer le compteur
function useCountUp(end: number, duration = 2000, start = 0) {
  const [count, setCount] = useState(start)
  const countRef = useRef(start)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const startTime = Date.now()
    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)

      // Easing function pour un effet plus fluide
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(start + (end - start) * easeOutQuart)

      if (currentCount !== countRef.current) {
        countRef.current = currentCount
        setCount(currentCount)
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [end, duration, start])

  return count
}

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({
    revenue: 0,
    publishedEvents: 0,
    activeVenues: 0,
  })
  const navigate = useNavigate()

  // Chargement des données au montage du composant
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [fetchedEvents, fetchedVenues, fetchedOrders] = await Promise.all(
          [
            eventService.getEvents({ includeAllStatuses: false }),
            venueService.getVenues(),
            orderService.getAllOrders(),
          ]
        )

        // Calcul des statistiques
        const totalRevenue = fetchedOrders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        )
        const publishedEvents = fetchedEvents.filter(
          (event) => event.status === 'PUBLISHED'
        )

        setStats({
          revenue: totalRevenue,
          publishedEvents: publishedEvents.length,
          activeVenues: fetchedVenues.length,
        })
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error)
        // En cas d'erreur, on garde les valeurs par défaut (0)
      }
    }

    loadStats()
  }, [])

  // Compteurs animés avec les vraies stats dynamiques
  const totalRevenue = useCountUp(stats.revenue)
  const eventsCount = useCountUp(stats.publishedEvents)
  const venuesCount = useCountUp(stats.activeVenues)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/events')
    }
  }

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
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mt-6 sm:mt-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher un événement, artiste, lieu..."
              className="pl-10 h-11 sm:h-12 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
          >
            Rechercher
          </Button>
        </form>

        {/* Stats avec compteurs animés */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 pt-8 sm:pt-10 md:pt-12">
          <div className="space-y-1 sm:space-y-2">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Revenus cumulés
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {eventsCount}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Événements publiés
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {venuesCount}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Lieux actifs
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
