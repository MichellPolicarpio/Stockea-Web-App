export type UserRole = 'admin' | 'owner' | 'verifier'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserPermissions {
  canViewAllBuildings: boolean
  canManageBuildings: boolean
  canViewAllApartments: boolean
  canManageApartments: boolean
  canManageInventory: boolean
  canCreateInspections: boolean
  canViewAllInspections: boolean
  canManageUsers: boolean
  canViewReports: boolean
  canManageSettings: boolean
}


