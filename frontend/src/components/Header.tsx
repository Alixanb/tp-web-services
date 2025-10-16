import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Ticket } from 'lucide-react'
import { MobileMenu } from './MobileMenu'

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Ticket className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              EventPass
            </span>
          </Link>

          {/* Mobile Menu */}
          <MobileMenu />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/events"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Événements
            </Link>
            <Link
              to="/my-tickets"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Mes billets
            </Link>
            <Link
              to="/my-orders"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Mes commandes
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Connexion</Link>
            </Button>
            <Button size="sm" className="whitespace-nowrap" asChild>
              <Link to="/organizer/events">Espace organisateur</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
