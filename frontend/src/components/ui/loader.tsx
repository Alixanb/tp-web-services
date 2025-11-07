import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoaderProps {
  size?: 'default' | 'small'
  variant?: 'default' | 'white'
  className?: string
}

export function Loader({ size = 'default', variant = 'default', className }: LoaderProps) {
  return (
    <Loader2
      className={cn(
        'animate-spin',
        size === 'small' ? 'h-4 w-4' : 'h-6 w-6',
        variant === 'white' ? 'text-white' : 'text-muted-foreground',
        className
      )}
    />
  )
}

