'use client'

import { cn } from "@/lib/utils"
import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Users,
  MoreHorizontal,
  Search,
  UserPlus,
  Edit2,
  Shield,
  UserCheck,
  Briefcase,
  Home,
  Trash2,
  CheckCircle2,
  XCircle,
  Save,
  Camera,
  Upload
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// --- TYPES ---
type UserRole = 'admin' | 'verifier' | 'owner'
type UserStatus = 'active' | 'inactive'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  lastLogin: string
  avatar?: string
  department?: string
}

// --- MOCK DATA ---
// --- MOCK DATA ---
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Michell Alexis Policarpio Moran',
    email: 'michell.policarpio@inventario.com',
    role: 'admin',
    status: 'active',
    lastLogin: 'Hace 5 minutos',
    department: 'Gestor',
    avatar: '',
  },
  {
    id: '2',
    name: 'Víctor Alejandro Olvera Méndez',
    email: 'victor.olvera@gmail.com',
    role: 'owner',
    status: 'active',
    lastLogin: 'Ayer',
    department: 'Casa Tortuga - Dept 1',
    avatar: '',
  },
  {
    id: '3',
    name: 'Juan Carlos Pérez González',
    email: 'juan.perez@inventario.com',
    role: 'verifier',
    status: 'active',
    lastLogin: 'Hace 2 horas',
    department: '',
    avatar: '',
  },
  {
    id: '4',
    name: 'Ana María López García',
    email: 'ana.lopez@inventario.com',
    role: 'verifier',
    status: 'inactive',
    lastLogin: 'Hace 5 días',
    department: '',
    avatar: '',
  },
  {
    id: '5',
    name: 'Sofía Isabel Vergara Díaz',
    email: 'sofia.vergara@outlook.com',
    role: 'owner',
    status: 'active',
    lastLogin: 'Hace 1 semana',
    department: 'Casa Tortuga - Dept 2',
    avatar: '',
  },
]

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Filter Logic
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // --- HANDLERS ---

  const handleCreateClick = () => {
    setEditingUser({
      id: '',
      name: '',
      email: '',
      role: 'verifier',
      status: 'active',
      lastLogin: 'Nunca',
      avatar: ''
    })
    setEditFirstName('')
    setEditLastName('')
    setIsEditOpen(true)
  }

  const handleEditClick = (user: User) => {
    setEditingUser(user)
    // Separar nombre y apellido para edición granular
    const parts = user.name.trim().split(/\s+/)
    if (parts.length > 0) {
      // Asumimos: Primer token es nombre, el resto apellidos. El usuario puede corregir.
      setEditFirstName(parts[0])
      setEditLastName(parts.slice(1).join(' '))
    } else {
      setEditFirstName(user.name)
      setEditLastName('')
    }
    setIsEditOpen(true)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && editingUser) {
      const imageUrl = URL.createObjectURL(file)
      setEditingUser({ ...editingUser, avatar: imageUrl })
    }
  }

  const handleRemoveAvatar = () => {
    if (editingUser) {
      setEditingUser({ ...editingUser, avatar: '' })
    }
  }

  const handleTriggerUpload = () => {
    fileInputRef.current?.click()
  }

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    const fullName = `${editFirstName} ${editLastName}`.trim()

    // Validación simple
    if (!fullName || !editingUser.email) {
      toast({
        title: "Error",
        description: "El nombre y el correo son obligatorios.",
        variant: "destructive"
      })
      return
    }

    const updatedUser = { ...editingUser, name: fullName }

    if (!editingUser.id) {
      // Crear nuevo usuario
      const newUser = { ...updatedUser, id: Date.now().toString() }
      setUsers([...users, newUser])
      toast({
        title: "Usuario Creado",
        description: `${fullName} ha sido registrado exitosamente.`
      })
    } else {
      // Actualizar existente
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u))
      toast({
        title: "Usuario Actualizado",
        description: `Los datos de ${fullName} han sido guardados.`,
      })
    }

    setIsEditOpen(false)
  }

  const toggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'active' ? 'inactive' : 'active'
        toast({
          title: newStatus === 'active' ? "Usuario Activado" : "Usuario Desactivado",
          description: `El estado del usuario ha cambiado a ${newStatus === 'active' ? 'Activo' : 'Inactivo'}.`,
          variant: newStatus === 'active' ? "default" : "destructive" // Rojo si se desactiva
        })
        return { ...u, status: newStatus }
      }
      return u
    }))
  }

  // --- RENDER HELPERS ---

  const getRoleBadge = (role: UserRole) => {
    return (
      <span className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
        role === 'admin' && "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/30",
        role === 'verifier' && "bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-900/30",
        role === 'owner' && "bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
      )}>
        {role === 'admin' && 'Administrador'}
        {role === 'verifier' && 'Verificador'}
        {role === 'owner' && 'Propietario'}
      </span>
    )
  }

  const getStatusIndication = (status: UserStatus) => {
    if (status === 'active') {
      return (
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
          <CheckCircle2 className="h-4 w-4" />
          Activo
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1.5 text-slate-400 font-medium text-sm">
        <XCircle className="h-4 w-4" />
        Inactivo
      </div>
    )
  }

  // --- MAIN RENDER ---

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto p-4 md:p-8">

      {/* Toolbar Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        <Button className="shrink-0" onClick={handleCreateClick}>
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* MOBILE CARD VIEW (Visible only on mobile) */}
      <div className="md:hidden space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">

            {/* Header: Avatar & Name */}
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <Avatar className="h-10 w-10 border border-slate-100 dark:border-slate-800">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs">
                    {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {user.status === 'active' && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500"></span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</div>
                <div className="text-xs text-slate-500 truncate">{user.email}</div>
              </div>
            </div>

            {/* Info Badges Row */}
            <div className="flex items-center gap-2 flex-wrap">
              {getRoleBadge(user.role)}

              <div className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border",
                user.status === 'active'
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30"
                  : "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
              )}>
                {user.status === 'active' ? 'Activo' : 'Inactivo'}
              </div>
            </div>

            {/* Actions Footer - Full Width Buttons for Touch */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => handleEditClick(user)}
              >
                <Edit2 className="h-3.5 w-3.5 mr-2" />
                Editar
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={cn("w-full", user.status === 'active' ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50")}
                onClick={() => toggleStatus(user.id)}
              >
                {user.status === 'active' ? (
                  <>
                    <XCircle className="h-3.5 w-3.5 mr-2" /> Desactivar
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Activar
                  </>
                )}
              </Button>
            </div>

          </div>
        ))}

        {filteredUsers.length === 0 && (
          <p className="text-center text-slate-400 py-8 text-sm">No se encontraron usuarios</p>
        )}
      </div>

      {/* DESKTOP TABLE VIEW (Visible only on md+) */}
      <div className="hidden md:block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <th className="px-3 md:px-6 py-4">Usuario</th>
                <th className="px-3 md:px-6 py-4">Rol</th>
                <th className="px-6 py-4 hidden lg:table-cell">Asignación</th>
                <th className="px-6 py-4 hidden lg:table-cell">Estado</th>
                <th className="px-6 py-4 text-right hidden lg:table-cell">Actividad</th>
                <th className="px-3 md:px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-3 md:px-6 py-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="relative shrink-0">
                        <Avatar className="h-9 w-9 md:h-10 md:w-10 border border-slate-100 dark:border-slate-800">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs">
                            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {user.status === 'active' && (
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500"></span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[110px] sm:max-w-none">{user.name}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[110px] sm:max-w-none">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 md:px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>

                  <td className="px-6 py-4 hidden lg:table-cell">
                    {user.department ? (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        {user.department === 'Gestor' ? <Briefcase className="h-4 w-4 text-slate-400" /> : <Home className="h-4 w-4 text-slate-400" />}
                        <span className="text-sm">{user.department}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Sin asignar</span>
                    )}
                  </td>

                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                      user.status === 'active'
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30"
                        : "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                    )}>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right hidden lg:table-cell text-slate-500 text-xs">
                    {user.lastLogin}
                  </td>

                  <td className="px-3 md:px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-primary hover:bg-rose-50 hover:text-primary transition-colors"
                        onClick={() => handleEditClick(user)}
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-primary hover:bg-rose-50 hover:text-primary transition-colors"
                        onClick={() => toggleStatus(user.id)}
                        title={user.status === 'active' ? "Desactivar" : "Activar"}
                      >
                        {user.status === 'active' ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <Search className="h-6 w-6 opacity-30" />
              </div>
              <p>No se encontraron resultados</p>
            </div>
          )}
        </div>
      </div>


      {/* EDIT USER DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingUser?.id ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}</DialogTitle>
            <DialogDescription>
              Modifica los detalles del usuario, incluyendo foto de perfil.
            </DialogDescription>
          </DialogHeader>

          {editingUser && (
            <form onSubmit={handleSaveUser} className="grid gap-6 py-4">

              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-4 border-slate-100 dark:border-slate-800 shadow-md cursor-pointer transition-opacity group-hover:opacity-90" onClick={handleTriggerUpload}>
                    <AvatarImage src={editingUser.avatar} className="object-cover" />
                    <AvatarFallback className="text-2xl bg-slate-200 dark:bg-slate-700 font-bold text-slate-500">
                      {editFirstName && editFirstName[0]}{editLastName && editLastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-sm cursor-pointer hover:bg-primary/90 transition-colors" onClick={(e) => { e.stopPropagation(); handleTriggerUpload(); }}>
                    <Camera className="h-4 w-4" />
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />

                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleTriggerUpload}>
                    <Upload className="h-3.5 w-3.5 mr-2" />
                    Subir Foto
                  </Button>
                  {editingUser.avatar && (
                    <Button type="button" variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={handleRemoveAvatar}>
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombres</Label>
                  <Input
                    id="firstName"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    placeholder="Ej. Juan Carlos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input
                    id="lastName"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    placeholder="Ej. Pérez González"
                  />
                </div>
              </div>

              {/* Other Fields */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select
                    value={editingUser.role}
                    onValueChange={(val: UserRole) => setEditingUser({ ...editingUser, role: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="verifier">Verificador</SelectItem>
                      <SelectItem value="owner">Propietario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={editingUser.status}
                    onValueChange={(val: UserStatus) => setEditingUser({ ...editingUser, status: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button type="submit" className="w-full sm:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  {editingUser.id ? 'Guardar Cambios' : 'Registrar Usuario'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}
