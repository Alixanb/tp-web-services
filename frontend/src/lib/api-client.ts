/**
 * Client API pour communiquer avec le backend EventPass
 * Gère automatiquement l'ajout du token JWT dans les headers
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public error?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface ApiResponse<T> {
  data: T
  status: number
}

/**
 * Récupère le token d'authentification stocké
 */
function getAuthToken(): string | null {
  return localStorage.getItem('token')
}

/**
 * Construit les headers de la requête avec authentification si disponible
 */
function buildHeaders(customHeaders?: HeadersInit): Headers {
  const headers = new Headers(customHeaders)
  
  // Ajouter Content-Type par défaut
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  
  // Ajouter le token d'authentification si disponible
  const token = getAuthToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  } else {
    console.warn('No auth token found in localStorage')
  }
  
  return headers
}

/**
 * Gère les erreurs HTTP et les transforme en ApiError
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`
    let errorType = response.statusText
    
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
      errorType = errorData.error || errorType
    } catch {
      // Si la réponse n'est pas du JSON, utiliser le message par défaut
    }
    
    // Si erreur 401, nettoyer le token et rediriger vers login
    if (response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    throw new ApiError(errorMessage, response.status, errorType)
  }
  
  // Pour les réponses 204 No Content
  if (response.status === 204) {
    return undefined as T
  }
  
  return response.json()
}

/**
 * Client API principal
 */
export const apiClient = {
  /**
   * Effectue une requête GET
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`)
    
    // Ajouter les paramètres de query string
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              url.searchParams.append(key, String(item))
            })
          } else {
            url.searchParams.append(key, String(value))
          }
        }
      })
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: buildHeaders(),
    })
    
    return handleResponse<T>(response)
  },

  /**
   * Effectue une requête POST
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })
    
    return handleResponse<T>(response)
  },

  /**
   * Effectue une requête PUT
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })
    
    return handleResponse<T>(response)
  },

  /**
   * Effectue une requête PATCH
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: buildHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })
    
    return handleResponse<T>(response)
  },

  /**
   * Effectue une requête DELETE
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    })
    
    return handleResponse<T>(response)
  },
}

