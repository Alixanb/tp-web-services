import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu, Ticket } from 'lucide-react'

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EventPass</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8 px-4">
          <Link
            to="/events"
            className="text-base font-medium hover:text-primary transition-colors py-2"
          >
            Événements
          </Link>
          <Link
            to="/my-tickets"
            className="text-base font-medium hover:text-primary transition-colors py-2"
          >
            Mes billets
          </Link>
          <Link
            to="/my-orders"
            className="text-base font-medium hover:text-primary transition-colors py-2"
          >
            Mes commandes
          </Link>
          <Link
            to="/organizer/events"
            className="text-base font-medium hover:text-primary transition-colors py-2"
          >
            Espace organisateur
          </Link>
          <div className="border-t pt-4 mt-4 space-y-3">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/login">Connexion</Link>
            </Button>
            <Button className="w-full" asChild>
              <Link to="/admin/dashboard">Admin</Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
