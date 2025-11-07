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
import { ApiError } from '@/lib/api-client'
import type { CreateEventDto } from '@/types/Event'
import type { Category } from '@/types/Category'
import type { Venue } from '@/types/Venue'

interface TicketCategoryForm {
  name: string
  price: string
  totalStock: string
  description: string
}

interface FormErrors {
  title?: string
  description?: string
  startDate?: string
  endDate?: string
  venueId?: string
  categoryId?: string
  imageUrl?: string
}

interface TicketCategoryErrors {
  name?: string
  price?: string
  totalStock?: string
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
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [ticketCategoryErrors, setTicketCategoryErrors] = useState<TicketCategoryErrors[]>([
    {},
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

    if (field === 'name' || field === 'price' || field === 'totalStock') {
      setTicketCategoryErrors((current) => {
        const next = [...current]
        const currentErrors = next[index] || {}
        if (!currentErrors[field]) {
          return next
        }
        const { [field]: _removed, ...rest } = currentErrors
        next[index] = rest
        return next
      })
    }
  }

  const addTicketCategory = () => {
    setTicketCategories((current) => [...current, { name: '', price: '', totalStock: '', description: '' }])
    setTicketCategoryErrors((current) => [...current, {}])
  }

  const removeTicketCategory = (index: number) => {
    setTicketCategories((current) => current.filter((_, i) => i !== index))
    setTicketCategoryErrors((current) => current.filter((_, i) => i !== index))
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
    setTicketCategoryErrors([{}])
    setFormErrors({})
    setError('')
  }

  const clearFormError = (field: keyof FormErrors) => {
    setFormErrors((current) => {
      if (!current[field]) {
        return current
      }
      const { [field]: _removed, ...rest } = current
      return rest
    })
  }

  const isValidUrl = (value: string) => {
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  const validateForm = (): CreateEventDto['ticketCategories'] | null => {
    const newFormErrors: FormErrors = {}
    const newTicketCategoryErrors: TicketCategoryErrors[] = ticketCategories.map(() => ({}))

    const trimmedTitle = form.title.trim()
    if (!trimmedTitle) {
      newFormErrors.title = 'Le titre est obligatoire.'
    }

    const trimmedDescription = form.description.trim()
    if (!trimmedDescription) {
      newFormErrors.description = 'La description est obligatoire.'
    }

    if (!form.startDate) {
      newFormErrors.startDate = 'La date de début est obligatoire.'
    }

    if (!form.endDate) {
      newFormErrors.endDate = 'La date de fin est obligatoire.'
    }

    const start = form.startDate ? new Date(form.startDate) : null
    const end = form.endDate ? new Date(form.endDate) : null

    if (start && Number.isNaN(start.getTime())) {
      newFormErrors.startDate = 'Format de date de début invalide.'
    }

    if (end && Number.isNaN(end.getTime())) {
      newFormErrors.endDate = 'Format de date de fin invalide.'
    }

    if (start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      if (end <= start) {
        newFormErrors.endDate = 'La date de fin doit être postérieure à la date de début.'
      }
    }

    if (!form.categoryId) {
      newFormErrors.categoryId = 'Sélectionnez une catégorie.'
    }

    if (!form.venueId) {
      newFormErrors.venueId = 'Sélectionnez un lieu.'
    }

    if (form.imageUrl && !isValidUrl(form.imageUrl)) {
      newFormErrors.imageUrl = "L'URL de l’image est invalide."
    }

    ticketCategories.forEach((ticketCategory, index) => {
      const errors: TicketCategoryErrors = {}
      const trimmedName = ticketCategory.name.trim()
      if (!trimmedName) {
        errors.name = 'Le nom de la catégorie est obligatoire.'
      }

      const price = Number(ticketCategory.price)
      if (ticketCategory.price === '') {
        errors.price = 'Le prix est obligatoire.'
      } else if (Number.isNaN(price)) {
        errors.price = 'Le prix doit être un nombre.'
      } else if (price <= 0) {
        errors.price = 'Le prix doit être supérieur à 0.'
      }

      const stock = Number(ticketCategory.totalStock)
      if (ticketCategory.totalStock === '') {
        errors.totalStock = 'Le stock est obligatoire.'
      } else if (!Number.isInteger(stock)) {
        errors.totalStock = 'Le stock doit être un entier.'
      } else if (stock <= 0) {
        errors.totalStock = 'Le stock doit être supérieur à 0.'
      }

      newTicketCategoryErrors[index] = errors
    })

    const hasFormErrors = Object.values(newFormErrors).some(Boolean)
    const hasTicketErrors = newTicketCategoryErrors.some((ticketError) =>
      Object.values(ticketError).some(Boolean)
    )

    if (hasFormErrors || hasTicketErrors) {
      setFormErrors(newFormErrors)
      setTicketCategoryErrors(newTicketCategoryErrors)
      setError('Veuillez corriger les erreurs indiquées.')
      return null
    }

    const preparedTicketCategories = ticketCategories.map((ticketCategory) => ({
      name: ticketCategory.name.trim(),
      price: Number(ticketCategory.price),
      totalStock: Number(ticketCategory.totalStock),
      description: ticketCategory.description.trim() || undefined,
    }))

    if (preparedTicketCategories.length === 0) {
      setError('Ajoutez au moins une catégorie de billet.')
      return null
    }

    setFormErrors({})
    setTicketCategoryErrors(newTicketCategoryErrors)
    setError('')

    return preparedTicketCategories
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const preparedTicketCategories = validateForm()

    if (!preparedTicketCategories) {
      return
    }

    const payload: CreateEventDto = {
      title: form.title.trim(),
      description: form.description.trim(),
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      imageUrl: form.imageUrl ? form.imageUrl.trim() : undefined,
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
      if (err instanceof ApiError) {
        setError(err.message || "Impossible de créer l'événement. Veuillez réessayer.")
      } else if (err instanceof Error) {
        setError(err.message || "Impossible de créer l'événement. Veuillez réessayer.")
      } else {
        setError("Impossible de créer l'événement. Veuillez réessayer.")
      }
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
                  onChange={(e) => {
                    setForm((current) => ({ ...current, title: e.target.value }))
                    clearFormError('title')
                  }}
                  placeholder="Nom de l'événement"
                />
                {formErrors.title && <p className="text-xs text-destructive">{formErrors.title}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image (URL)</label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) => {
                    setForm((current) => ({ ...current, imageUrl: e.target.value }))
                    clearFormError('imageUrl')
                  }}
                  placeholder="https://..."
                />
                {formErrors.imageUrl && <p className="text-xs text-destructive">{formErrors.imageUrl}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description*</label>
              <Textarea
                value={form.description}
                onChange={(e) => {
                  setForm((current) => ({ ...current, description: e.target.value }))
                  clearFormError('description')
                }}
                rows={4}
                placeholder="Décrivez votre événement..."
              />
              {formErrors.description && (
                <p className="text-xs text-destructive">{formErrors.description}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de début*</label>
                <Input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => {
                    setForm((current) => ({ ...current, startDate: e.target.value }))
                    clearFormError('startDate')
                  }}
                />
                {formErrors.startDate && <p className="text-xs text-destructive">{formErrors.startDate}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de fin*</label>
                <Input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) => {
                    setForm((current) => ({ ...current, endDate: e.target.value }))
                    clearFormError('endDate')
                  }}
                />
                {formErrors.endDate && <p className="text-xs text-destructive">{formErrors.endDate}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie*</label>
                <select
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.categoryId}
                  onChange={(e) => {
                    setForm((current) => ({ ...current, categoryId: e.target.value }))
                    clearFormError('categoryId')
                  }}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && <p className="text-xs text-destructive">{formErrors.categoryId}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Lieu*</label>
                <select
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.venueId}
                  onChange={(e) => {
                    setForm((current) => ({ ...current, venueId: e.target.value }))
                    clearFormError('venueId')
                  }}
                >
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name} • {venue.city}
                    </option>
                  ))}
                </select>
                {formErrors.venueId && <p className="text-xs text-destructive">{formErrors.venueId}</p>}
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
                          />
                          {ticketCategoryErrors[index]?.name && (
                            <p className="text-xs text-destructive">{ticketCategoryErrors[index]?.name}</p>
                          )}
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
                          />
                          {ticketCategoryErrors[index]?.price && (
                            <p className="text-xs text-destructive">{ticketCategoryErrors[index]?.price}</p>
                          )}
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
                          />
                          {ticketCategoryErrors[index]?.totalStock && (
                            <p className="text-xs text-destructive">{ticketCategoryErrors[index]?.totalStock}</p>
                          )}
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

