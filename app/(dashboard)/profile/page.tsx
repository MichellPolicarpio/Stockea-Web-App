'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Camera,
  Edit2,
  Lock,
  Loader2,
  KeyRound
} from 'lucide-react'

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  owner: 'Propietario',
  verifier: 'Verificador',
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()

  // Estados Locales
  const [isLoading, setIsLoading] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)

  // Estado para Edición de Perfil
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '+52 55 1234 5678', // Dato simulado
  })

  // Estado para Contraseña
  const [passData, setPassData] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  // Estado para Foto
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sincronizar datos
  useEffect(() => {
    if (user) {
      const nameParts = user.name.split(' ')
      const first = nameParts[0] || ''
      const last = nameParts.slice(1).join(' ') || ''

      setFormData(prev => ({
        ...prev,
        firstName: first,
        lastName: last,
        email: user.email
      }))
      setAvatarUrl(user.avatar || '')
    }
  }, [user])

  if (!user) return null

  // Handlers
  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({ title: "Formato inválido", description: "Por favor sube una imagen (JPG, PNG).", variant: "destructive" })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Archivo muy grande", description: "El tamaño máximo es 5MB.", variant: "destructive" })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string)
        toast({ title: "Foto actualizada", description: "Tu foto de perfil se ha actualizado correctamente." })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleProfileUpdate = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsEditOpen(false)
      toast({ title: "Perfil actualizado", description: "Tus datos han sido guardados exitosamente." })
    }, 1000)
  }

  const handlePasswordUpdate = () => {
    if (!passData.current || !passData.new || !passData.confirm) {
      toast({ title: "Error", description: "Todos los campos son obligatorios.", variant: "destructive" })
      return
    }
    if (passData.new !== passData.confirm) {
      toast({ title: "Error", description: "Las nuevas contraseñas no coinciden.", variant: "destructive" })
      return
    }
    if (passData.new.length < 6) {
      toast({ title: "Error", description: "La contraseña debe tener al menos 6 caracteres.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsPasswordOpen(false)
      setPassData({ current: '', new: '', confirm: '' })
      toast({ title: "Contraseña cambiada", description: "Tu contraseña ha sido actualizada segura." })
    }, 1500)
  }

  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  const registerDate = new Date(user.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  const fullName = `${formData.firstName} ${formData.lastName}`.trim() || user.name

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto p-4 md:px-8 md:pb-8 md:pt-0 md:-mt-2">

      {/* TARJETA PRINCIPAL: DATOS PERSONALES */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">

        <CardHeader className="pb-4 pt-8 px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">

            <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
              {/* AVATAR Clean */}
              <div className="relative group">
                <Avatar className="h-24 w-24 border border-slate-200 dark:border-slate-700 shadow-md">
                  <AvatarImage src={avatarUrl} className="object-cover" />
                  <AvatarFallback className="text-3xl bg-slate-50 text-slate-400">{initials}</AvatarFallback>
                </Avatar>
                <button
                  onClick={handlePhotoClick}
                  className="absolute bottom-0 right-0 p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-md hover:scale-105 transition-transform"
                  title="Cambiar Foto"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="mb-1 space-y-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{fullName}</h1>
                <div className="flex items-center gap-2 justify-center md:justify-start text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700">
                    <Shield className="h-3 w-3" /> {roleLabels[user.role] || user.role}
                  </span>
                  <span className="text-sm">• {user.email}</span>
                </div>
              </div>
            </div>

            {/* Botones de Acción Desktop */}
            <div className="hidden sm:flex items-center gap-3 mb-2">
              <Button onClick={() => setIsPasswordOpen(true)} variant="outline" size="sm" className="text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
                <KeyRound className="h-4 w-4 mr-2" />
                Cambiar Contraseña
              </Button>
              <Button onClick={() => setIsEditOpen(true)} className="btn-airbnb-effect shadow-md text-white border-0" size="sm">
                <Edit2 className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8 pt-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Bloque 1: Contacto */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Phone className="h-4 w-4 text-blue-500" /> Información de Contacto
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400 font-normal">Correo Electrónico</Label>
                  <p className="font-medium text-slate-700 dark:text-slate-200">{formData.email}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400 font-normal">Teléfono Móvil</Label>
                  <p className="font-medium text-slate-700 dark:text-slate-200">{formData.phone}</p>
                </div>
              </div>
            </div>

            {/* Bloque 2: Sistema */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Shield className="h-4 w-4 text-indigo-500" /> Datos del Sistema
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400 font-normal">ID de Usuario</Label>
                  <p className="font-mono text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded w-fit select-all">{user.id}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400 font-normal">Miembro Desde</Label>
                  <p className="font-medium text-slate-700 dark:text-slate-200">{registerDate}</p>
                </div>
              </div>
            </div>

            {/* Bloque 3: Estado (Visual) */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 flex flex-col justify-center items-center text-center space-y-2 border border-slate-100 dark:border-slate-800">
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Cuenta Activa</p>
                <p className="text-xs text-slate-500 max-w-[200px]">Tu cuenta tiene acceso completo a las funciones asignadas a tu rol.</p>
              </div>
            </div>

          </div>

          {/* Acciones Móviles */}
          <div className="flex flex-col gap-2 mt-6 sm:hidden">
            <Button onClick={() => setIsEditOpen(true)} className="w-full btn-airbnb-effect shadow-md text-white border-0">
              Editar Datos
            </Button>
            <Button onClick={() => setIsPasswordOpen(true)} className="w-full" variant="outline">
              Cambiar Contraseña
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* MODAL EDITAR PERFIL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Información</DialogTitle>
            <DialogDescription>
              Modifica tus datos de contacto y nombre.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-firstname">Nombre(s)</Label>
                <Input
                  id="edit-firstname"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-lastname">Apellidos</Label>
                <Input
                  id="edit-lastname"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Teléfono</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleProfileUpdate} disabled={isLoading} className="btn-airbnb-effect text-white border-0">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL CAMBIAR CONTRASEÑA */}
      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-slate-500" />
              Cambiar Contraseña
            </DialogTitle>
            <DialogDescription>
              Asegúrate de usar una contraseña segura.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="current-pass">Contraseña Actual</Label>
              <Input
                id="current-pass"
                type="password"
                placeholder="••••••••"
                value={passData.current}
                onChange={(e) => setPassData({ ...passData, current: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-pass">Nueva Contraseña</Label>
              <Input
                id="new-pass"
                type="password"
                placeholder="••••••••"
                value={passData.new}
                onChange={(e) => setPassData({ ...passData, new: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-pass">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirm-pass"
                type="password"
                placeholder="••••••••"
                value={passData.confirm}
                onChange={(e) => setPassData({ ...passData, confirm: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordOpen(false)}>Cancelar</Button>
            <Button onClick={handlePasswordUpdate} disabled={isLoading} className="btn-airbnb-effect text-white border-0">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar Contraseña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
