export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCategoryDto {
  name: string
  description?: string
  icon?: string
}

export interface UpdateCategoryDto {
  name?: string
  description?: string
  icon?: string
}
