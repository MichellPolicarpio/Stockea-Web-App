export type InventoryStatus = 'ok' | 'damaged' | 'missing' | 'needs_replacement'

export interface InventoryItem {
  id: string
  apartmentId: string
  name: string
  description?: string
  category: string
  status: InventoryStatus
  quantity: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface InventoryCategory {
  id: string
  name: string
  description?: string
}


