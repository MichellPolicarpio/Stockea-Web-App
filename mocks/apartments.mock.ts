import { Apartment } from '@/types/apartment'

export const mockApartments: Apartment[] = [
  // Building 1 - Casa Tortuga (4 Deptos)
  { id: 'apt-1', buildingId: 'building-1', number: '1', floor: 1, ownerId: 'owner-1', status: 'occupied', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'apt-2', buildingId: 'building-1', number: '2', floor: 1, ownerId: 'owner-1', status: 'occupied', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'apt-3', buildingId: 'building-1', number: '3', floor: 2, ownerId: 'owner-2', status: 'occupied', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'apt-4', buildingId: 'building-1', number: '4', floor: 2, status: 'vacant', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },

  // Building 2 - Casa Bamba (Muestra)
  { id: 'apt-5', buildingId: 'building-2', number: '101', floor: 1, status: 'occupied', createdAt: new Date('2024-01-05'), updatedAt: new Date('2024-01-05') },
  { id: 'apt-6', buildingId: 'building-2', number: '102', floor: 1, status: 'occupied', createdAt: new Date('2024-01-05'), updatedAt: new Date('2024-01-05') },
  { id: 'apt-7', buildingId: 'building-2', number: '201', floor: 2, status: 'maintenance', createdAt: new Date('2024-01-05'), updatedAt: new Date('2024-01-05') },

  // Building 3 - Vista Mar (8 Deptos)
  { id: 'vm-1', buildingId: 'building-3', number: '101', floor: 1, status: 'occupied', createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-10') },
  { id: 'vm-2', buildingId: 'building-3', number: '102', floor: 1, status: 'vacant', createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-10') },
  { id: 'vm-3', buildingId: 'building-3', number: '201', floor: 2, status: 'occupied', createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-10') },
  { id: 'vm-4', buildingId: 'building-3', number: '202', floor: 2, status: 'occupied', createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-10') },
  { id: 'vm-5', buildingId: 'building-3', number: '301', floor: 3, status: 'occupied', createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-10') },
  { id: 'vm-6', buildingId: 'building-3', number: '302', floor: 3, status: 'maintenance', createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-10') },
  { id: 'vm-7', buildingId: 'building-3', number: '401', floor: 4, status: 'vacant', createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-10') },
  { id: 'vm-8', buildingId: 'building-3', number: '402', floor: 4, status: 'occupied', createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-10') },

  // Building 4 - El Palmar (12 Deptos)
  { id: 'ep-1', buildingId: 'building-4', number: '101', floor: 1, status: 'occupied', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-15') },
  { id: 'ep-2', buildingId: 'building-4', number: '102', floor: 1, status: 'occupied', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-15') },
  { id: 'ep-3', buildingId: 'building-4', number: '103', floor: 1, status: 'vacant', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-15') },
  { id: 'ep-4', buildingId: 'building-4', number: '201', floor: 2, status: 'occupied', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-15') },
  { id: 'ep-5', buildingId: 'building-4', number: '202', floor: 2, status: 'occupied', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-15') },
  { id: 'ep-6', buildingId: 'building-4', number: '203', floor: 2, status: 'maintenance', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-15') },
  { id: 'ep-7', buildingId: 'building-4', number: '301', floor: 3, status: 'occupied', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-15') },
  { id: 'ep-8', buildingId: 'building-4', number: '302', floor: 3, status: 'vacant', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-15') },
  { id: 'ep-9', buildingId: 'building-4', number: '303', floor: 3, status: 'occupied', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-15') },
  { id: 'ep-10', buildingId: 'building-4', number: '401', floor: 4, status: 'occupied', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-15') },
  { id: 'ep-11', buildingId: 'building-4', number: '402', floor: 4, status: 'occupied', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-15') },
  { id: 'ep-12', buildingId: 'building-4', number: '403', floor: 4, status: 'vacant', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-15') },
]
