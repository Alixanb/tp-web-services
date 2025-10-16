import { Ticket } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-8 sm:mt-12 md:mt-16">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Ticket className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">EventPass</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Votre plateforme de confiance pour découvrir et réserver des
              billets pour tous les événements.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Événements</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Concerts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Festivals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Conférences
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Sports
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Carrières
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Presse
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Centre d'aide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Sécurité
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p className="px-4">
            © 2025 EventPass. Tous droits réservés. Plateforme de billetterie
            sécurisée.
          </p>
        </div>
      </div>
    </footer>
  )
}
