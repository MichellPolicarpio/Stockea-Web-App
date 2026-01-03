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
  Calendar,
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
          title: 'Programación',
          url: '/reports',
          icon: Calendar,
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
          title: 'Programación',
          url: '/reports',
          icon: Calendar,
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
          title: 'Asignaciones',
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
