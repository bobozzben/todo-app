export interface User {
  id: number
  email: string
  name: string
  phone?: string
  address?: string
  company?: string
  position?: string
  notes?: string
  createdAt: string
}

export interface Task {
  id: number
  title: string
  completed: boolean
  userId: number
  createdAt: string
}

export interface AuthUser {
  id: number
  email: string
  name: string
}
