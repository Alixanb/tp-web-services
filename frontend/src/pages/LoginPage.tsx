import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { authService } from '@/services/auth.service'
import type { LoginDto } from '@/types/User'
import { Ticket } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function LoginPage() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState<LoginDto>({
    email: 'client@eventpass.com',
    password: 'password',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authService.login(credentials)
      // Rediriger en fonction du rôle
      if (response.user.role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else if (response.user.role === 'ORGANIZER') {
        navigate('/organizer/events')
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      setError('Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Ticket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              EventPass
            </span>
          </div>
          <CardTitle>Connexion</CardTitle>
          <p className="text-sm text-muted-foreground">
            Connectez-vous pour accéder à votre compte
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
              />
            </div>

            {error && (
              <div className="text-sm text-destructive text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>

            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Comptes de test :</p>
              <p className="text-xs">CLIENT: client@eventpass.com</p>
              <p className="text-xs">ORGANIZER: organizer@eventpass.com</p>
              <div className="text-xs">
                <p className='font-bold'>ADMIN:</p>
                <pre>admin@eventpass.com</pre>
                <pre>password123</pre>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
