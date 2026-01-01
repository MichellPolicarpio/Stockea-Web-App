import { Building } from '@/types/building'

export const mockBuildings: Building[] = [
  {
    id: 'building-1',
    name: 'Casa Tortuga',
    address: 'C. Francisco Canal y Av. Revillagigedo',
    totalApartments: 4,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'building-2',
    name: 'Complejo Los Jardines',
    address: 'Calle Secundaria 456, Ciudad',
    totalApartments: 36,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: 'building-3',
    name: 'Edificio Central',
    address: 'Plaza Mayor 789, Ciudad',
    totalApartments: 18,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
]


