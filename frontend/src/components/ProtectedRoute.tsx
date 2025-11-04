import { Navigate } from 'react-router-dom'
import { authService } from '@/services/auth.service'
import type { UserRole } from '@/types/User'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const currentUser = authService.getCurrentUser()

  // Si l'utilisateur n'est pas connecté
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  // Si l'utilisateur n'a pas le rôle requis
  if (!allowedRoles.includes(currentUser.role)) {
    // Rediriger en fonction du rôle
    if (currentUser.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />
    } else if (currentUser.role === 'ORGANIZER') {
      return <Navigate to="/organizer/events" replace />
    } else {
      return <Navigate to="/" replace />
    }
  }

  // Si tout est OK, afficher le contenu
  return <>{children}</>
}
