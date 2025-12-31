import { InventoryItem } from '@/types/inventory'
import { mockInventory } from '@/mocks/inventory.mock'

export const inventoryService = {
  async getByApartmentId(apartmentId: string): Promise<InventoryItem[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockInventory.filter(item => item.apartmentId === apartmentId)
  },
  
  async getById(id: string): Promise<InventoryItem | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockInventory.find(item => item.id === id) || null
  },
  
  async create(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockInventory.push(newItem)
    return newItem
  },
  
  async update(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const item = mockInventory.find(i => i.id === id)
    if (!item) return null
    
    Object.assign(item, updates, { updatedAt: new Date() })
    return item
  },
  
  async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockInventory.findIndex(i => i.id === id)
    if (index === -1) return false
    
    mockInventory.splice(index, 1)
    return true
  },
}


