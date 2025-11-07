import { Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-8 sm:mt-12 md:mt-16">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Ticket className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">EventPass</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Votre plateforme de confiance pour découvrir et réserver des
              billets pour tous les événements.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="hover:text-foreground transition-colors"
                >
                  Tous les événements
                </Link>
              </li>
              <li>
                <Link
                  to="/my-tickets"
                  className="hover:text-foreground transition-colors"
                >
                  Mes billets
                </Link>
              </li>
              <li>
                <Link
                  to="/my-orders"
                  className="hover:text-foreground transition-colors"
                >
                  Mes commandes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Organisateurs</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/login"
                  className="hover:text-foreground transition-colors"
                >
                  Devenir organisateur
                </Link>
              </li>
              <li>
                <Link
                  to="/organizer/events"
                  className="hover:text-foreground transition-colors"
                >
                  Mes événements
                </Link>
              </li>
              <li>
                <Link
                  to="/organizer/events/new"
                  className="hover:text-foreground transition-colors"
                >
                  Créer un événement
                </Link>
              </li>
              <li>
                <Link
                  to="/organizer/sales"
                  className="hover:text-foreground transition-colors"
                >
                  Rapports de ventes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Mon compte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/login"
                  className="hover:text-foreground transition-colors"
                >
                  Connexion
                </Link>
              </li>
              <li>
                <Link
                  to="/my-orders"
                  className="hover:text-foreground transition-colors"
                >
                  Mes commandes
                </Link>
              </li>
              <li>
                <Link
                  to="/my-tickets"
                  className="hover:text-foreground transition-colors"
                >
                  Mes billets
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/dashboard"
                  className="hover:text-foreground transition-colors"
                >
                  Espace admin
                </Link>
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
