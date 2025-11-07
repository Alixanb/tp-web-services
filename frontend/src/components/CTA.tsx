import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

export function CTA() {
  return (
    <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
        <CardContent className="p-6 sm:p-8 md:p-12 text-center space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold px-2">
            Vous organisez des événements ?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Rejoignez notre plateforme et gérez vos événements en toute
            simplicité. Billetterie en ligne, gestion des places, rapports
            détaillés et bien plus.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 max-w-md sm:max-w-none mx-auto">
            <Button
              asChild
              size="lg"
              variant="default"
              className="text-sm sm:text-base w-full sm:w-auto"
            >
              <Link to="/login">Devenir organisateur</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-sm sm:text-base w-full sm:w-auto"
            >
              En savoir plus
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
