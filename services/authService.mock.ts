import { User } from '@/types/user'
import { mockUsersWithPasswords } from '@/mocks/users.mock'

const STORAGE_KEY = 'inventario_current_user'

export const authService = {
  async login(credentials: { username: string; password: string }): Promise<User> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log('authService.login - Buscando usuario con:', credentials)
    console.log('Usuarios disponibles:', mockUsersWithPasswords.map(u => ({ username: u.username, email: u.email, role: u.role })))
    
    // Buscar usuario por username o email y verificar contraseña
    const userWithPassword = mockUsersWithPasswords.find(
      u => {
        const matchesUsername = u.username?.toLowerCase() === credentials.username.toLowerCase()
        const matchesEmail = u.email.toLowerCase() === credentials.username.toLowerCase()
        const matchesPassword = u.password === credentials.password
        
        console.log(`Usuario ${u.username || u.email}:`, {
          matchesUsername,
          matchesEmail,
          matchesPassword,
          username: u.username,
          email: u.email,
          inputUsername: credentials.username
        })
        
        return (matchesUsername || matchesEmail) && matchesPassword
      }
    )
    
    if (!userWithPassword) {
      console.error('No se encontró usuario con esas credenciales')
      throw new Error('Credenciales incorrectas. Verifica tu usuario y contraseña.')
    }
    
    console.log('Usuario encontrado:', userWithPassword)
    
    // Extraer solo los datos del usuario sin la contraseña
    const { password, username, ...user } = userWithPassword
    
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      console.log('Usuario guardado en localStorage')
    }
    
    return user
  },
  
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  },
  
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') {
      return null
    }
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return null
    }
    
    try {
      const user = JSON.parse(stored)
      // Convertir fechas de string a Date
      user.createdAt = new Date(user.createdAt)
      user.updatedAt = new Date(user.updatedAt)
      return user
    } catch {
      return null
    }
  },
  
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  },
}

