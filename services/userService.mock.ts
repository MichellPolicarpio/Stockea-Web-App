import { User } from '@/types/user'
import { mockUsers } from '@/mocks/users.mock'
import { ownerAssignments, verifierAssignments } from '@/mocks/assignments.mock'

export const userService = {
  async getAll(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...mockUsers]
  },
  
  async getById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockUsers.find(u => u.id === id) || null
  },
  
  async getByRole(role: User['role']): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockUsers.filter(u => u.role === role)
  },
  
  async getOwners(): Promise<User[]> {
    return this.getByRole('owner')
  },
  
  async getVerifiers(): Promise<User[]> {
    return this.getByRole('verifier')
  },
  
  async getOwnerAssignments(ownerId: string): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return ownerAssignments[ownerId] || []
  },
  
  async getVerifierAssignments(verifierId: string): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return verifierAssignments[verifierId] || []
  },
  
  async assignApartmentsToOwner(ownerId: string, apartmentIds: string[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    ownerAssignments[ownerId] = apartmentIds
  },
  
  async assignApartmentsToVerifier(verifierId: string, apartmentIds: string[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    verifierAssignments[verifierId] = apartmentIds
  },
  
  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newUser: User = {
      ...user,
      id: `${user.role}-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockUsers.push(newUser)
    return newUser
  },
  
  async update(id: string, updates: Partial<User>): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const user = mockUsers.find(u => u.id === id)
    if (!user) return null
    
    Object.assign(user, updates, { updatedAt: new Date() })
    return user
  },
  
  async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockUsers.findIndex(u => u.id === id)
    if (index === -1) return false
    
    mockUsers.splice(index, 1)
    return true
  },
}


