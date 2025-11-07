import { useState } from 'react'
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
import type { User } from '@/types/User'

interface MobileMenuProps {
  currentUser: User | null
  accountLink: string
  accountLabel: string
  onLogout: () => void
}

export function MobileMenu({ currentUser, accountLink, accountLabel, onLogout }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
            {currentUser ? (
              <>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={accountLink} onClick={() => setOpen(false)}>
                    {accountLabel}
                  </Link>
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    onLogout()
                    setOpen(false)
                  }}
                >
                  Se déconnecter
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    Connexion
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link to="/organizer/events" onClick={() => setOpen(false)}>
                    Espace organisateur
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
