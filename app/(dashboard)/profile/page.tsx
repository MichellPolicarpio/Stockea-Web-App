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
  KeyRound,
  FileText,
  Printer,
  Building2,
  Upload,
  ImageIcon
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

  // Estado para Branding
  const [branding, setBranding] = useState({
    logo: null as string | null,
    companyName: '',
    displayOption: 'logo_company' as 'logo_company' | 'company_only' | 'admin_name'
  })
  const logoInputRef = useRef<HTMLInputElement>(null)

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

  // Handlers para Branding
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setBranding(prev => ({ ...prev, logo: ev.target?.result as string }))
        toast({ title: "Logo cargado", description: "El logo se ha adjuntado para la vista previa." })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveBranding = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({ title: "Configuración guardada", description: "Tus preferencias de documentos se han actualizado." })
    }, 1000)
  }

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

      {/* TARJETA SECUNDARIA: BRANDING DE DOCUMENTOS */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 pt-8 px-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Personalización de Reportes y Documentos</CardTitle>
              <CardDescription>Configura cómo aparece tu identidad en los reportes PDF impresos.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Columna Izquierda: Configuración */}
            <div className="space-y-8">

              {/* Sección Logo */}
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-slate-500" /> Logo de la Empresa
                </Label>
                <div className="flex items-start gap-4">
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="h-24 w-24 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-slate-50 dark:bg-slate-900 overflow-hidden relative group"
                  >
                    {branding.logo ? (
                      <>
                        <img src={branding.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit2 className="h-5 w-5 text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 mb-1" />
                        <span className="text-[10px] font-medium">Subir</span>
                      </>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Sube tu logo corporativo. Este aparecerá en la esquina superior de todos los reportes generados.
                    </p>
                    <p className="text-xs text-slate-400">Recomendado: PNG con fondo transparente, máx 2MB.</p>
                    <input
                      type="file"
                      ref={logoInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </div>
                </div>
              </div>

              {/* Sección Opciones de Visualización */}
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-500" /> Preferencias de Encabezado
                </Label>

                <div className="space-y-3">
                  {/* Opción 1: Logo + Nombre Empresa */}
                  <div
                    onClick={() => setBranding({ ...branding, displayOption: 'logo_company' })}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${branding.displayOption === 'logo_company' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
                  >
                    <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center ${branding.displayOption === 'logo_company' ? 'border-blue-500' : 'border-slate-300'}`}>
                      {branding.displayOption === 'logo_company' && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${branding.displayOption === 'logo_company' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200'}`}>Logo y Nombre de Empresa</span>
                      <p className="text-xs text-slate-500 mt-0.5">Muestra tu logo y el nombre de la organización.</p>
                    </div>
                  </div>

                  {/* Opción 2: Solo Nombre Empresa */}
                  <div
                    onClick={() => setBranding({ ...branding, displayOption: 'company_only' })}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${branding.displayOption === 'company_only' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
                  >
                    <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center ${branding.displayOption === 'company_only' ? 'border-blue-500' : 'border-slate-300'}`}>
                      {branding.displayOption === 'company_only' && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${branding.displayOption === 'company_only' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200'}`}>Solo Nombre de Empresa</span>
                      <p className="text-xs text-slate-500 mt-0.5">Si no tienes logo, se mostrará el nombre de tu empresa en texto grande.</p>
                    </div>
                  </div>

                  {/* Opción 3: Nombre del Admin */}
                  <div
                    onClick={() => setBranding({ ...branding, displayOption: 'admin_name' })}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${branding.displayOption === 'admin_name' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
                  >
                    <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center ${branding.displayOption === 'admin_name' ? 'border-blue-500' : 'border-slate-300'}`}>
                      {branding.displayOption === 'admin_name' && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${branding.displayOption === 'admin_name' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200'}`}>Usar mi Nombre ({fullName})</span>
                      <p className="text-xs text-slate-500 mt-0.5">Para gestores independientes. Se usará tu nombre personal como cabecera.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Nombre Empresa */}
              {(branding.displayOption === 'logo_company' || branding.displayOption === 'company_only') && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label htmlFor="company-name">Nombre de la Empresa / Organización</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="company-name"
                      placeholder="Ej. Gestión Inmobiliaria SA de CV"
                      className="pl-9"
                      value={branding.companyName}
                      onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <Button onClick={handleSaveBranding} disabled={isLoading} className="w-full md:w-auto btn-airbnb-effect border-0 text-white shadow-md">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Preferencias
              </Button>

            </div>

            {/* Columna Derecha: Live Preview */}
            <div className="bg-slate-100 dark:bg-slate-950 rounded-xl p-8 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Vista Previa Documento</p>

              {/* Hoja A4 Simulada */}
              <div className="w-full aspect-[1/1.41] max-w-[320px] bg-white text-slate-900 shadow-2xl rounded-sm p-6 flex flex-col relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02]">
                {/* Header Documento */}
                <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-500 w-fit mb-1">REPORTE #001</span>
                    <span className="text-lg font-bold leading-tight uppercase">
                      INFORME DE<br />ESTADO
                    </span>
                  </div>

                  {/* Branding Logic */}
                  <div className="flex flex-col items-end text-right max-w-[120px]">
                    {branding.displayOption === 'logo_company' && (
                      <>
                        {branding.logo ? (
                          <img src={branding.logo} className="h-8 object-contain mb-1" alt="Logo" />
                        ) : (
                          <div className="h-8 w-8 bg-slate-200 rounded mb-1 flex items-center justify-center text-[8px] text-slate-500">LOGO</div>
                        )}
                        <span className="text-[10px] font-bold truncate w-full">{branding.companyName || 'Nombre Empresa'}</span>
                      </>
                    )}
                    {branding.displayOption === 'company_only' && (
                      <span className="text-sm font-bold truncate w-full">{branding.companyName || 'Nombre Empresa'}</span>
                    )}
                    {branding.displayOption === 'admin_name' && (
                      <span className="text-xs font-bold truncate w-full">{fullName}</span>
                    )}
                    <span className="text-[8px] text-slate-400 mt-0.5">Gestión Profesional</span>
                  </div>
                </div>

                {/* Dummy Content */}
                <div className="space-y-3 flex-1 opacity-40">
                  <div className="h-2 bg-slate-200 rounded w-3/4" />
                  <div className="h-2 bg-slate-200 rounded w-full" />
                  <div className="h-2 bg-slate-200 rounded w-5/6" />

                  <div className="mt-6 grid grid-cols-2 gap-2">
                    <div className="h-20 bg-slate-100 rounded border border-slate-200" />
                    <div className="h-20 bg-slate-100 rounded border border-slate-200" />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center opacity-60">
                  <div className="h-1.5 w-16 bg-slate-200 rounded" />
                  <div className="h-1.5 w-4 bg-slate-300 rounded" />
                </div>
              </div>
            </div>
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
