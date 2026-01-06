import { User } from '@/types/user'

// Usuarios con credenciales simuladas
export interface UserWithPassword extends User {
  password: string
  username?: string
}

export const mockUsersWithPasswords: UserWithPassword[] = [
  {
    id: 'admin-1',
    name: 'Administrador Principal',
    email: 'admin@inventario.com',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'owner-1',
    name: 'Victor Alejandro Olvera Mendez',
    email: 'victor.olvera@gmail.com',
    username: 'victor.olvera',
    password: 'owner123',
    role: 'owner',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'owner-2',
    name: 'María González',
    email: 'maria.gonzalez@example.com',
    username: 'maria.gonzalez',
    password: 'owner123',
    role: 'owner',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'verifier-1',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@example.com',
    username: 'carlos.rodriguez',
    password: 'verifier123',
    role: 'verifier',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'verifier-2',
    name: 'Ana Martínez',
    email: 'ana.martinez@example.com',
    username: 'ana.martinez',
    password: 'verifier123',
    role: 'verifier',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
  },
]

export const mockUsers: User[] = mockUsersWithPasswords.map(({ password, username, ...user }) => user)

