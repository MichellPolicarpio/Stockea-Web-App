import { Building } from '@/types/building'

export const mockBuildings: Building[] = [
  {
    id: 'building-1',
    name: 'Casa Tortuga',
    address: 'Av. Costera 123, Zona Hotelera',
    totalApartments: 4,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'building-2',
    name: 'Casa Bamba',
    address: 'Blvd. Las Palmas 88, Playa Norte',
    totalApartments: 10,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: 'building-3',
    name: 'Vista Mar',
    address: 'Camino al Faro 45, Acantilados',
    totalApartments: 8,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'building-4',
    name: 'El Palmar',
    address: 'Zona Hotelera Km 5, Malecón',
    totalApartments: 12,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
]


