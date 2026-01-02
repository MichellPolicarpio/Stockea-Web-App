'use client'

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

    // Update User State
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u))

    setIsEditOpen(false)
    toast({
      title: "Usuario Actualizado",
      description: `Los datos de ${fullName} han sido guardados.`,
    })
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
    const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

    switch (role) {
      case 'admin':
        return <span className={`${baseClasses} border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900`}>Administrador</span>
      case 'verifier':
        return <span className={`${baseClasses} border-teal-200 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-900`}>Verificador</span>
      case 'owner':
        return <span className={`${baseClasses} border-slate-200 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700`}>Propietario</span>
      default:
        return <span className={`${baseClasses} border-slate-200 text-slate-900`}>Usuario</span>
    }
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
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Buscar usuarios..."
              className="pl-9 bg-white dark:bg-slate-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
            <UserPlus className="h-4 w-4 mr-2" />
            Nuevo
          </Button>
        </div>
      </div>

      {/* Premium Users Table */}
      <div className="overflow-x-auto pb-10">
        <table className="w-full text-sm text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
              <th className="px-4 py-2 ml-4">Usuario</th>
              <th className="px-4 py-2 hidden md:table-cell">Rol</th>
              <th className="px-4 py-2 hidden md:table-cell">Asignación</th>
              <th className="px-4 py-2 hidden md:table-cell">Estado</th>
              <th className="px-4 py-2 text-right hidden md:table-cell">Última Actividad</th>
              <th className="px-4 py-2 text-right pr-6">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-300">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-200 group border border-slate-100 dark:border-slate-800 rounded-xl"
              >

                {/* User Info with Status Ring */}
                <td className="px-4 py-4 rounded-l-xl border-l border-y border-slate-100 dark:border-slate-800 group-hover:border-slate-200 dark:group-hover:border-slate-700">
                  <div className="flex items-center gap-4 pl-2">
                    <div className={`relative rounded-full p-0.5 ${user.status === 'active' ? 'bg-gradient-to-tr from-emerald-400 to-emerald-600' : 'bg-slate-200'}`}>
                      <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-900">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs">
                          {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online Dot */}
                      <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-base">{user.name}</div>
                      <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-4 py-4 border-y border-slate-100 dark:border-slate-800 group-hover:border-slate-200 dark:group-hover:border-slate-700 hidden md:table-cell">
                  {getRoleBadge(user.role)}
                </td>

                {/* Assignment */}
                <td className="px-4 py-4 border-y border-slate-100 dark:border-slate-800 group-hover:border-slate-200 dark:group-hover:border-slate-700 hidden md:table-cell">
                  {user.department ? (
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-500">
                        {user.department === 'Gestor' ? <Briefcase className="h-3.5 w-3.5" /> : <Home className="h-3.5 w-3.5" />}
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.department}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 opacity-50 px-2">--</span>
                  )}
                </td>

                {/* Status Text (Simplified) */}
                <td className="px-4 py-4 border-y border-slate-100 dark:border-slate-800 group-hover:border-slate-200 dark:group-hover:border-slate-700 hidden md:table-cell">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${user.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>

                {/* Last Activity */}
                <td className="px-4 py-4 text-right border-y border-slate-100 dark:border-slate-800 group-hover:border-slate-200 dark:group-hover:border-slate-700 hidden md:table-cell">
                  <span className="text-xs font-medium text-slate-400">{user.lastLogin}</span>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 text-right rounded-r-xl border-r border-y border-slate-100 dark:border-slate-800 group-hover:border-slate-200 dark:group-hover:border-slate-700 pr-6">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(user)}
                      className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full"
                      title="Editar Perfil"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleStatus(user.id)}
                      className={user.status === 'active'
                        ? "h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full"
                        : "h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full"
                      }
                      title={user.status === 'active' ? "Desactivar Usuario" : "Activar Usuario"}
                    >
                      {user.status === 'active' ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 mt-4">
            <Search className="h-8 w-8 mb-3 opacity-20" />
            <p>No se encontraron usuarios</p>
          </div>
        )}
      </div>


      {/* EDIT USER DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
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
                  <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow-sm cursor-pointer hover:bg-blue-700 transition-colors" onClick={(e) => { e.stopPropagation(); handleTriggerUpload(); }}>
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
                <Button type="submit" className="bg-airbnb-rausch hover:bg-[#ff385c] text-white w-full sm:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}
