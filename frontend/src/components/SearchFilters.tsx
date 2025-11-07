import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { categoryService } from '@/services/category.service'
import type { Category } from '@/types/Category'
import type { EventFilters } from '@/types/Event'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface SearchFiltersProps {
  filters: EventFilters
  onFiltersChange: (filters: EventFilters) => void
  onSearch: () => void
}

export function SearchFilters({
  filters,
  onFiltersChange,
  onSearch,
}: SearchFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error)
      }
    }
    loadCategories()
  }, [])

  const selectedCategoryIds = filters.categoryIds || []

  const toggleCategory = (categoryId: string) => {
    const newCategoryIds = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter((id) => id !== categoryId)
      : [...selectedCategoryIds, categoryId]

    onFiltersChange({
      ...filters,
      categoryIds: newCategoryIds.length > 0 ? newCategoryIds : undefined,
    })
  }

  const clearCategories = () => {
    onFiltersChange({
      ...filters,
      categoryIds: undefined,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher un événement, artiste, lieu..."
            className="pl-10 h-11 sm:h-12 text-sm"
            value={filters.search || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
          />
        </div>
        <Button
          size="lg"
          className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
          onClick={onSearch}
        >
          Rechercher
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {categories.map((category) => {
              const isSelected = selectedCategoryIds.includes(category.id)
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={`px-5 py-2 rounded-xl text-base transition-colors text-center border cursor-pointer ${isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
                    }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {category.icon ? (
                      <span aria-hidden>{category.icon}</span>
                    ) : null}
                    <span>{category.name}</span>
                  </span>
                </button>
              )
            })}
          </div>
          {selectedCategoryIds.length > 0 && (
            <Button variant="ghost" size="lg" onClick={clearCategories}>
              <X className="h-4 w-4 mr-1" />
              Effacer
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
