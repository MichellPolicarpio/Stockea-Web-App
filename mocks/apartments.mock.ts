import { Apartment } from '@/types/apartment'

export const mockApartments: Apartment[] = [
  // Building 1 - Casa Tortuga
  { id: 'apt-1', buildingId: 'building-1', number: '1', floor: 1, ownerId: 'owner-1', status: 'occupied', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'apt-2', buildingId: 'building-1', number: '2', floor: 1, ownerId: 'owner-1', status: 'occupied', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'apt-3', buildingId: 'building-1', number: '3', floor: 2, ownerId: 'owner-2', status: 'occupied', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'apt-4', buildingId: 'building-1', number: '4', floor: 2, status: 'vacant', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },

  // Building 2 - Complejo Los Jardines
  { id: 'apt-5', buildingId: 'building-2', number: '301', floor: 3, ownerId: 'owner-1', status: 'occupied', createdAt: new Date('2024-01-05'), updatedAt: new Date('2024-01-05') },
  { id: 'apt-6', buildingId: 'building-2', number: '302', floor: 3, ownerId: 'owner-2', status: 'occupied', createdAt: new Date('2024-01-05'), updatedAt: new Date('2024-01-05') },
  { id: 'apt-7', buildingId: 'building-2', number: '401', floor: 4, status: 'maintenance', createdAt: new Date('2024-01-05'), updatedAt: new Date('2024-01-05') },

  // Building 3 - Edificio Central
  { id: 'apt-8', buildingId: 'building-3', number: '501', floor: 5, ownerId: 'owner-2', status: 'occupied', createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-10') },
  { id: 'apt-9', buildingId: 'building-3', number: '502', floor: 5, status: 'vacant', createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-10') },
]


