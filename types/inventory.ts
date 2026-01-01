export type InventoryStatus = 'ok' | 'damaged' | 'missing' | 'needs_replacement'

export type InventoryCategoryType = 'Mobiliario' | 'Electrodomesticos' | 'Electronica' | 'Cocina y Utensilios' | 'Decoracion' | 'Otros'

export interface InventoryItem {
  id: string
  apartmentId: string
  name: string
  description?: string
  category: InventoryCategoryType
  status: InventoryStatus
  quantity: number
  image?: string // Base64 Data URL
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface InventoryCategory {
  id: string
  name: InventoryCategoryType
  description?: string
}


