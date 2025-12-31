import { Inspection, InspectionStatus } from '@/types/inspection'
import { User } from '@/types/user'

// Mock de inspecciones almacenadas en memoria
let mockInspections: Inspection[] = [
  {
    id: 'insp-1',
    apartmentId: 'apt-1',
    verifierId: 'verifier-1',
    status: 'completed',
    items: [
      { inventoryItemId: 'inv-1', status: 'ok' },
      { inventoryItemId: 'inv-2', status: 'ok' },
      { inventoryItemId: 'inv-3', status: 'ok' },
      { inventoryItemId: 'inv-4', status: 'issue', notes: 'Patas débiles' },
    ],
    generalNotes: 'Todo en orden excepto la mesa',
    completedAt: new Date('2024-02-01'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'insp-2',
    apartmentId: 'apt-2',
    verifierId: 'verifier-1',
    status: 'completed',
    items: [
      { inventoryItemId: 'inv-5', status: 'ok' },
      { inventoryItemId: 'inv-6', status: 'ok' },
      { inventoryItemId: 'inv-7', status: 'ok' },
    ],
    completedAt: new Date('2024-02-02'),
    createdAt: new Date('2024-02-02'),
    updatedAt: new Date('2024-02-02'),
  },
]

export const inspectionService = {
  async getByApartmentId(apartmentId: string): Promise<Inspection[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockInspections.filter(i => i.apartmentId === apartmentId)
  },
  
  async getByVerifierId(verifierId: string): Promise<Inspection[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockInspections.filter(i => i.verifierId === verifierId)
  },
  
  async getById(id: string): Promise<Inspection | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockInspections.find(i => i.id === id) || null
  },
  
  async create(inspection: Omit<Inspection, 'id' | 'createdAt' | 'updatedAt'>): Promise<Inspection> {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newInspection: Inspection = {
      ...inspection,
      id: `insp-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockInspections.push(newInspection)
    return newInspection
  },
  
  async update(id: string, updates: Partial<Inspection>): Promise<Inspection | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const inspection = mockInspections.find(i => i.id === id)
    if (!inspection) return null
    
    Object.assign(inspection, updates, { updatedAt: new Date() })
    return inspection
  },
  
  async getAll(): Promise<Inspection[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...mockInspections]
  },
}


