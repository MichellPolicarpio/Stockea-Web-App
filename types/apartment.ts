export interface Apartment {
  id: string
  buildingId: string
  number: string
  floor?: number
  ownerId?: string
  status: 'occupied' | 'vacant' | 'maintenance'
  createdAt: Date
  updatedAt: Date
}


