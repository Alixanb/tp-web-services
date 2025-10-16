export type UserRole = 'CLIENT' | 'ORGANIZER' | 'ADMIN'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  phoneNumber?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserDto {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
  role?: UserRole
}

export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  email?: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}
