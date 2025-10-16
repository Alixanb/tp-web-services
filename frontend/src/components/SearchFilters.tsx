import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import type { EventFilters } from '@/types/Event'

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

      {/* Advanced filters can be added here */}
    </div>
  )
}
