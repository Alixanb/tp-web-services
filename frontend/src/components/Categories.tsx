import { Card, CardContent } from '@/components/ui/card'
import { Music, PartyPopper, Briefcase, TrendingUp } from 'lucide-react'

export function Categories() {
  const categories = [
    { name: 'Musique', icon: Music, count: 245 },
    { name: 'Festival', icon: PartyPopper, count: 128 },
    { name: 'Business', icon: Briefcase, count: 89 },
    { name: 'Sport', icon: TrendingUp, count: 156 },
  ]

  return (
    <section className="container mx-auto px-4 py-8 sm:py-12">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Parcourir par catégorie
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((category) => (
          <Card
            key={category.name}
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-primary"
          >
            <CardContent className="p-4 sm:p-6 text-center space-y-2">
              <category.icon className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-primary" />
              <div className="font-semibold text-sm sm:text-base">
                {category.name}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {category.count} événements
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
