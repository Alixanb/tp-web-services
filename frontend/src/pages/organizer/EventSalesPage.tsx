import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, Ticket, Users, TrendingUp } from 'lucide-react'
import type { SalesReport } from '@/types/Report'

export function EventSalesPage() {
  const [report, setReport] = useState<SalesReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSalesReport()
  }, [])

  const loadSalesReport = async () => {
    setLoading(true)
    try {
      // TODO: Appeler l'API SOAP reportService.getSalesReport()
      console.log('Chargement du rapport de vente')
    } catch (error) {
      console.error('Erreur lors du chargement du rapport:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Rapport des ventes
            </h1>
            <p className="text-muted-foreground mt-2">
              Analysez les performances de vos événements
            </p>
          </div>
          <Button variant="outline">Exporter le rapport</Button>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : report ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Revenu total
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {report.totalRevenue}€
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Billets vendus
                  </CardTitle>
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{report.ticketsSold}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Prix moyen
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(report.totalRevenue / report.ticketsSold).toFixed(2)}€
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Catégories
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {report.ticketsByCategory.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Ventes par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.ticketsByCategory.map((category) => (
                    <div
                      key={category.categoryName}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{category.categoryName}</p>
                        <p className="text-sm text-muted-foreground">
                          {category.sold} billets vendus
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {category.revenue}€
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Aucun rapport disponible pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
