import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Loader } from '@/components/ui/loader'
import { eventService } from '@/services/event.service'
import { categoryService } from '@/services/category.service'
import { venueService } from '@/services/venue.service'
import type { CreateEventDto } from '@/types/Event'
import type { Category } from '@/types/Category'
import type { Venue } from '@/types/Venue'

interface TicketCategoryForm {
  name: string
  price: string
  totalStock: string
  description: string
}

export function CreateEventPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [ticketCategories, setTicketCategories] = useState<TicketCategoryForm[]>([
    { name: '', price: '', totalStock: '', description: '' },
  ])
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    venueId: '',
    categoryId: '',
    imageUrl: '',
  })

  useEffect(() => {
    const loadReferences = async () => {
      try {
        const [fetchedCategories, fetchedVenues] = await Promise.all([
          categoryService.getCategories(),
          venueService.getVenues(),
        ])
        setCategories(fetchedCategories)
        setVenues(fetchedVenues)
        if (fetchedCategories.length > 0) {
          setForm((current) => ({ ...current, categoryId: fetchedCategories[0].id }))
        }
        if (fetchedVenues.length > 0) {
          setForm((current) => ({ ...current, venueId: fetchedVenues[0].id }))
        }
      } catch (err) {
        console.error('Erreur lors du chargement des références:', err)
        setError('Impossible de charger les catégories et lieux disponibles.')
      } finally {
        setInitialLoading(false)
      }
    }

    loadReferences()
  }, [])

  const handleTicketCategoryChange = (
    index: number,
    field: keyof TicketCategoryForm,
    value: string
  ) => {
    setTicketCategories((current) =>
      current.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const addTicketCategory = () => {
    setTicketCategories((current) => [...current, { name: '', price: '', totalStock: '', description: '' }])
  }

  const removeTicketCategory = (index: number) => {
    setTicketCategories((current) => current.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      venueId: venues[0]?.id || '',
      categoryId: categories[0]?.id || '',
      imageUrl: '',
    })
    setTicketCategories([{ name: '', price: '', totalStock: '', description: '' }])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.title || !form.description || !form.startDate || !form.endDate || !form.venueId || !form.categoryId) {
      setError('Veuillez renseigner tous les champs obligatoires.')
      return
    }

    const preparedTicketCategories = ticketCategories
      .filter((tc) => tc.name && tc.price && tc.totalStock)
      .map((tc) => ({
        name: tc.name,
        price: Number(tc.price),
        totalStock: Number(tc.totalStock),
        description: tc.description || undefined,
      }))

    if (preparedTicketCategories.length === 0) {
      setError('Ajoutez au moins une catégorie de billet complète.')
      return
    }

    const payload: CreateEventDto = {
      title: form.title,
      description: form.description,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      imageUrl: form.imageUrl || undefined,
      venueId: form.venueId,
      categoryId: form.categoryId,
      ticketCategories: preparedTicketCategories,
    }

    setLoading(true)
    try {
      await eventService.createEvent(payload)
      resetForm()
      alert('Événement créé avec succès !')
      navigate('/organizer/events')
    } catch (err) {
      console.error('Erreur lors de la création de l’événement:', err)
      setError("Impossible de créer l'événement. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Créer un événement</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Renseignez les informations principales et vos catégories de billets.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/organizer/events')}>
          Retour à mes événements
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Titre*</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
                  placeholder="Nom de l'événement"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image (URL)</label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) => setForm((current) => ({ ...current, imageUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description*</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                rows={4}
                placeholder="Décrivez votre événement..."
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de début*</label>
                <Input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => setForm((current) => ({ ...current, startDate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de fin*</label>
                <Input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) => setForm((current) => ({ ...current, endDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie*</label>
                <select
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.categoryId}
                  onChange={(e) => setForm((current) => ({ ...current, categoryId: e.target.value }))}
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Lieu*</label>
                <select
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.venueId}
                  onChange={(e) => setForm((current) => ({ ...current, venueId: e.target.value }))}
                  required
                >
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name} • {venue.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Catégories de billets</h2>
                <Button type="button" variant="outline" onClick={addTicketCategory}>
                  Ajouter une catégorie
                </Button>
              </div>

              <div className="space-y-4">
                {ticketCategories.map((ticketCategory, index) => (
                  <Card key={index} className="border-dashed">
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nom*</label>
                          <Input
                            value={ticketCategory.name}
                            onChange={(e) => handleTicketCategoryChange(index, 'name', e.target.value)}
                            placeholder="Ex: Billet standard"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Prix*</label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={ticketCategory.price}
                            onChange={(e) => handleTicketCategoryChange(index, 'price', e.target.value)}
                            placeholder="Prix en euros"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Stock total*</label>
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            value={ticketCategory.totalStock}
                            onChange={(e) => handleTicketCategoryChange(index, 'totalStock', e.target.value)}
                            placeholder="Nombre de billets disponibles"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <Input
                            value={ticketCategory.description}
                            onChange={(e) => handleTicketCategoryChange(index, 'description', e.target.value)}
                            placeholder="Information complémentaire"
                          />
                        </div>
                      </div>
                      {ticketCategories.length > 1 && (
                        <div className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeTicketCategory(index)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={resetForm} disabled={loading}>
                Réinitialiser
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Créer l’événement'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

