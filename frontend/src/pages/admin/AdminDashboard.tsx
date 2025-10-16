import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Calendar, MapPin, TrendingUp } from 'lucide-react'

export function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Tableau de bord Admin
          </h1>
          <p className="text-muted-foreground mt-2">
            Vue d'ensemble de la plateforme
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Utilisateurs totaux
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+20% ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Événements actifs
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12% ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lieux</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">+3 ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Revenu total
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">145,231€</div>
              <p className="text-xs text-muted-foreground">+18% ce mois</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Gérer les utilisateurs
              </Button>
              <Button variant="outline" className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Gérer les lieux
              </Button>
              <Button variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Rapports globaux
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
