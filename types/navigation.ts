import { LucideIcon } from 'lucide-react'

export interface SidebarItem {
  title: string
  url?: string
  icon?: LucideIcon
  badge?: string | number
  items?: SidebarItem[]
  permission?: string
}


