import { Apartment } from '@/types/apartment'
import { mockApartments } from '@/mocks/apartments.mock'
import { ownerAssignments } from '@/mocks/assignments.mock'
import { User } from '@/types/user'

export const apartmentService = {
  async getAll(): Promise<Apartment[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...mockApartments]
  },
  
  async getByBuildingId(buildingId: string): Promise<Apartment[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockApartments.filter(a => a.buildingId === buildingId)
  },
  
  async getById(id: string): Promise<Apartment | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockApartments.find(a => a.id === id) || null
  },
  
  async getByOwnerId(ownerId: string): Promise<Apartment[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockApartments.filter(a => a.ownerId === ownerId)
  },
  
  async getByVerifierId(verifierId: string): Promise<Apartment[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const { verifierAssignments } = await import('@/mocks/assignments.mock')
    const assignedApartmentIds = verifierAssignments[verifierId] || []
    return mockApartments.filter(a => assignedApartmentIds.includes(a.id))
  },
  
  async getAccessibleApartments(user: User): Promise<Apartment[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    if (user.role === 'admin') {
      return [...mockApartments]
    } else if (user.role === 'owner') {
      return this.getByOwnerId(user.id)
    } else if (user.role === 'verifier') {
      return this.getByVerifierId(user.id)
    }
    
    return []
  },
  
  async create(apartment: Omit<Apartment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Apartment> {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newApartment: Apartment = {
      ...apartment,
      id: `apt-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockApartments.push(newApartment)
    return newApartment
  },
  
  async update(id: string, updates: Partial<Apartment>): Promise<Apartment | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const apartment = mockApartments.find(a => a.id === id)
    if (!apartment) return null
    
    Object.assign(apartment, updates, { updatedAt: new Date() })
    return apartment
  },
  
  async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockApartments.findIndex(a => a.id === id)
    if (index === -1) return false
    
    mockApartments.splice(index, 1)
    return true
  },
}


