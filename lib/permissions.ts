import { UserRole } from '@/types/user'
import { SidebarItem } from '@/types/navigation'
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  Home,
  ClipboardList,
  History,
  User,
  BarChart3,
} from 'lucide-react'

export function getMenuByRole(role: UserRole): SidebarItem[] {
  switch (role) {
    case 'admin':
      return [
        {
          title: 'Panel Principal',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Edificios',
          url: '/buildings',
          icon: Building2,
          items: [
            {
              title: 'Lista de edificios',
              url: '/buildings',
            },
          ],
        },
        {
          title: 'Usuarios',
          icon: Users,
          url: '/users', // Simplificado para evitar subniveles vacíos por ahora
        },
        {
          title: 'Reportes',
          url: '/reports',
          icon: BarChart3,
        },
        {
          title: 'Configuración',
          url: '/settings',
          icon: Settings,
        },
      ]

    case 'owner':
      return [
        {
          title: 'Panel Principal',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Mis Departamentos',
          url: '/apartments',
          icon: Home,
        },
        {
          title: 'Reportes',
          url: '/reports',
          icon: BarChart3,
        },
        {
          title: 'Configuración',
          url: '/settings',
          icon: Settings,
        },
      ]

    case 'verifier':
      return [
        {
          title: 'Panel Principal',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Departamentos Asignados',
          url: '/apartments',
          icon: ClipboardList,
        },
        {
          title: 'Historial',
          url: '/inspections',
          icon: History,
        },
        {
          title: 'Perfil',
          url: '/profile',
          icon: User,
        },
      ]

    default:
      return []
  }
}

export function hasPermission(userRole: UserRole, permission: string): boolean {
  // Mock simple
  return true
}
