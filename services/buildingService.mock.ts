import { Building } from '@/types/building'
import { mockBuildings } from '@/mocks/buildings.mock'

export const buildingService = {
  async getAll(): Promise<Building[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...mockBuildings]
  },
  
  async getById(id: string): Promise<Building | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockBuildings.find(b => b.id === id) || null
  },
  
  async create(building: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>): Promise<Building> {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newBuilding: Building = {
      ...building,
      id: `building-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockBuildings.push(newBuilding)
    return newBuilding
  },
  
  async update(id: string, updates: Partial<Building>): Promise<Building | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const building = mockBuildings.find(b => b.id === id)
    if (!building) return null
    
    Object.assign(building, updates, { updatedAt: new Date() })
    return building
  },
  
  async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockBuildings.findIndex(b => b.id === id)
    if (index === -1) return false
    
    mockBuildings.splice(index, 1)
    return true
  },
}


