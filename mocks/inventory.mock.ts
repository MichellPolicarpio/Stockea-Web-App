import { InventoryItem } from '@/types/inventory'

export const mockInventory: InventoryItem[] = [
  // Apartment 1
  { id: 'inv-1', apartmentId: 'apt-1', name: 'Refrigerador', category: 'Electrodomesticos', status: 'ok', quantity: 1, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'inv-2', apartmentId: 'apt-1', name: 'Microondas', category: 'Electrodomesticos', status: 'ok', quantity: 1, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'inv-3', apartmentId: 'apt-1', name: 'Sofá', category: 'Mobiliario', status: 'ok', quantity: 1, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'inv-4', apartmentId: 'apt-1', name: 'Mesa de comedor', category: 'Mobiliario', status: 'damaged', quantity: 1, notes: 'Patas débiles', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-15') },

  // Apartment 2
  { id: 'inv-5', apartmentId: 'apt-2', name: 'Refrigerador', category: 'Electrodomesticos', status: 'ok', quantity: 1, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'inv-6', apartmentId: 'apt-2', name: 'Lavadora', category: 'Electrodomesticos', status: 'ok', quantity: 1, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'inv-7', apartmentId: 'apt-2', name: 'Cama', category: 'Mobiliario', status: 'ok', quantity: 2, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },

  // Apartment 3
  { id: 'inv-8', apartmentId: 'apt-3', name: 'Refrigerador', category: 'Electrodomesticos', status: 'ok', quantity: 1, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'inv-9', apartmentId: 'apt-3', name: 'Televisor', category: 'Electrodomesticos', status: 'missing', quantity: 1, notes: 'No encontrado en última verificación', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-20') },

  // Apartment 5
  { id: 'inv-10', apartmentId: 'apt-5', name: 'Refrigerador', category: 'Electrodomesticos', status: 'ok', quantity: 1, createdAt: new Date('2024-01-05'), updatedAt: new Date('2024-01-05') },
  { id: 'inv-11', apartmentId: 'apt-5', name: 'Sofá', category: 'Mobiliario', status: 'ok', quantity: 1, createdAt: new Date('2024-01-05'), updatedAt: new Date('2024-01-05') },

  // Apartment 6
  { id: 'inv-12', apartmentId: 'apt-6', name: 'Refrigerador', category: 'Electrodomesticos', status: 'ok', quantity: 1, createdAt: new Date('2024-01-05'), updatedAt: new Date('2024-01-05') },
  { id: 'inv-13', apartmentId: 'apt-6', name: 'Microondas', category: 'Electrodomesticos', status: 'ok', quantity: 1, createdAt: new Date('2024-01-05'), updatedAt: new Date('2024-01-05') },

  // Apartment 8
  { id: 'inv-14', apartmentId: 'apt-8', name: 'Refrigerador', category: 'Electrodomesticos', status: 'ok', quantity: 1, createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-10') },
  { id: 'inv-15', apartmentId: 'apt-8', name: 'Lavadora', category: 'Electrodomesticos', status: 'ok', quantity: 1, createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-10') },
]


