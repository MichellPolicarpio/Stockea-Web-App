import { UserRole } from './user'

export interface RolePermissions {
  [key: string]: boolean
}

export const PERMISSIONS = {
  VIEW_ALL_BUILDINGS: 'view_all_buildings',
  MANAGE_BUILDINGS: 'manage_buildings',
  VIEW_ALL_APARTMENTS: 'view_all_apartments',
  MANAGE_APARTMENTS: 'manage_apartments',
  MANAGE_INVENTORY: 'manage_inventory',
  CREATE_INSPECTIONS: 'create_inspections',
  VIEW_ALL_INSPECTIONS: 'view_all_inspections',
  MANAGE_USERS: 'manage_users',
  VIEW_REPORTS: 'view_reports',
  MANAGE_SETTINGS: 'manage_settings',
} as const

export function getPermissionsByRole(role: UserRole): RolePermissions {
  switch (role) {
    case 'admin':
      return {
        [PERMISSIONS.VIEW_ALL_BUILDINGS]: true,
        [PERMISSIONS.MANAGE_BUILDINGS]: true,
        [PERMISSIONS.VIEW_ALL_APARTMENTS]: true,
        [PERMISSIONS.MANAGE_APARTMENTS]: true,
        [PERMISSIONS.MANAGE_INVENTORY]: true,
        [PERMISSIONS.CREATE_INSPECTIONS]: true,
        [PERMISSIONS.VIEW_ALL_INSPECTIONS]: true,
        [PERMISSIONS.MANAGE_USERS]: true,
        [PERMISSIONS.VIEW_REPORTS]: true,
        [PERMISSIONS.MANAGE_SETTINGS]: true,
      }
    case 'owner':
      return {
        [PERMISSIONS.VIEW_ALL_BUILDINGS]: false,
        [PERMISSIONS.MANAGE_BUILDINGS]: false,
        [PERMISSIONS.VIEW_ALL_APARTMENTS]: false,
        [PERMISSIONS.MANAGE_APARTMENTS]: false,
        [PERMISSIONS.MANAGE_INVENTORY]: true,
        [PERMISSIONS.CREATE_INSPECTIONS]: false,
        [PERMISSIONS.VIEW_ALL_INSPECTIONS]: false,
        [PERMISSIONS.MANAGE_USERS]: false,
        [PERMISSIONS.VIEW_REPORTS]: true,
        [PERMISSIONS.MANAGE_SETTINGS]: false,
      }
    case 'verifier':
      return {
        [PERMISSIONS.VIEW_ALL_BUILDINGS]: false,
        [PERMISSIONS.MANAGE_BUILDINGS]: false,
        [PERMISSIONS.VIEW_ALL_APARTMENTS]: false,
        [PERMISSIONS.MANAGE_APARTMENTS]: false,
        [PERMISSIONS.MANAGE_INVENTORY]: false,
        [PERMISSIONS.CREATE_INSPECTIONS]: true,
        [PERMISSIONS.VIEW_ALL_INSPECTIONS]: false,
        [PERMISSIONS.MANAGE_USERS]: false,
        [PERMISSIONS.VIEW_REPORTS]: false,
        [PERMISSIONS.MANAGE_SETTINGS]: false,
      }
    default:
      return {}
  }
}


