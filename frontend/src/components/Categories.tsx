import { Card, CardContent } from '@/components/ui/card'
import { categoryService } from '@/services/category.service'
import { eventService } from '@/services/event.service'
import type { Category } from '@/types/Category'
import type { LucideIcon } from 'lucide-react'
import {
  Briefcase,
  Clapperboard,
  Flag,
  Music,
  Palette,
  PartyPopper,
  Tag,
  TrendingUp,
  UtensilsCrossed,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

interface CategorySummary extends Category {
  eventCount: number
}

const iconDictionary: Record<string, LucideIcon> = {
  Musique: Music,
  Festival: PartyPopper,
  Business: Briefcase,
  Sport: TrendingUp,
  Art: Palette,
  Cinéma: Clapperboard,
  Politique: Flag,
  Gastronomie: UtensilsCrossed,
}

function resolveIcon(categoryName: string) {
  return iconDictionary[categoryName] ?? Tag
}

export function Categories() {
  const [categories, setCategories] = useState<CategorySummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let canceled = false
    const fetchCategories = async () => {
      setLoading(true)
      setError(null)
      try {
        const [categoryData, eventData] = await Promise.all([
          categoryService.getCategories(),
          eventService.getEvents(),
        ])
        if (canceled) {
          return
        }
        const counts = eventData.reduce<Record<string, number>>(
          (accumulator, eventItem) => {
            const categoryId = eventItem.category?.id
            if (!categoryId) {
              return accumulator
            }
            accumulator[categoryId] = (accumulator[categoryId] || 0) + 1
            return accumulator
          },
          {}
        )
        const summaries = categoryData
          .map<CategorySummary>((category) => ({
            ...category,
            eventCount: counts[category.id] || 0,
          }))
          .sort((a, b) => b.eventCount - a.eventCount)
        setCategories(summaries)
      } catch (err) {
        if (!canceled) {
          console.error('Erreur lors du chargement des catégories:', err)
          setError('Impossible de charger les catégories.')
        }
      } finally {
        if (!canceled) {
          setLoading(false)
        }
      }
    }

    fetchCategories()

    return () => {
      canceled = true
    }
  }, [])

  const highlightedCategories = useMemo(() => categories.slice(0, 8), [categories])

  return (
    <section className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-xl font-bold sm:text-2xl">Parcourir par catégorie</h2>
        <p className="text-sm text-muted-foreground">
          Classement selon les événements actuellement disponibles
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-6 text-sm text-destructive">
          {error}
        </div>
      ) : loading ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
          Chargement des catégories...
        </div>
      ) : highlightedCategories.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
          Aucune catégorie disponible.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
          {highlightedCategories.map((category) => {
            const Icon = resolveIcon(category.name)
            return (
              <Link
                key={category.id}
                to={`/events?categoryIds=${category.id}`}
              >
                <Card className="cursor-pointer border-2 transition-all hover:scale-105 hover:border-primary hover:shadow-lg">
                  <CardContent className="space-y-2 p-4 text-center sm:space-y-3 sm:p-6">
                    <Icon className="mx-auto h-8 w-8 text-primary sm:h-10 sm:w-10" />
                    <div className="text-sm font-semibold sm:text-base">
                      {category.name}
                    </div>
                    <div className="text-xs text-muted-foreground sm:text-sm">
                      {category.eventCount.toLocaleString('fr-FR')} événements
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
