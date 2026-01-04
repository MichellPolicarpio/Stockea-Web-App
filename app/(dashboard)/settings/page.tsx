'use client'

import { cn } from "@/lib/utils"
import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  Bell,
  Settings,
  Lock,
  Save,
  Languages,
  Moon,
  Sun,
  Shield,
  FileCheck,
  AlertTriangle,
  FileEdit
} from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)

  const handlePasswordUpdate = () => {
    setIsLoading(true)

    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios.",
        variant: "destructive"
      })
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las nuevas contraseñas no coinciden.",
        variant: "destructive"
      })
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Contraseña insegura",
        description: "La contraseña debe tener al menos 6 caracteres.",
        variant: "destructive"
      })
      setIsLoading(false)
      return
    }

    // Simulación de éxito
    setTimeout(() => {
      toast({
        title: "Contraseña Actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente.",
        variant: "default" // Verde por defecto en shadcn modificado o default style
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setIsLoading(false)
    }, 1000)
  }

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center p-8 h-[50vh]">
        <div className="text-center space-y-4">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full w-fit mx-auto">
            <Shield className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Acceso Restringido</h2>
          <p className="text-slate-500 max-w-sm mx-auto">
            Solo los administradores pueden acceder a la configuración global.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 pb-24 md:px-8 md:pb-8 md:pt-0 md:-mt-2">



      <div className="grid gap-6 md:grid-cols-2 items-start">
        {/* --- NOTIFICATIONS SECTION --- */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notificaciones
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Inspección</CardTitle>
              <CardDescription>Configura cuándo deseas recibir notificaciones automáticas.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">

              <div className="flex items-center justify-between space-x-4 border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-full">
                    <FileCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900 dark:text-white leading-none">Inspección Finalizada</p>
                    <p className="text-sm text-slate-500">Notificar al completar una verificación.</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between space-x-4 border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900 dark:text-white leading-none">Reporte de Daños</p>
                    <p className="text-sm text-slate-500">Alerta inmediata si se registran daños.</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between space-x-4 border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full">
                    <FileEdit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900 dark:text-white leading-none">Edición por Terceros</p>
                    <p className="text-sm text-slate-500">Notificar cambios de Propietarios/Verificadores.</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

            </CardContent>
          </Card>
        </section>

        {/* --- GENERAL SECTION --- */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            General
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Interfaz</CardTitle>
              <CardDescription>Personaliza tu experiencia visual y de idioma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Languages className="h-5 w-5 text-slate-500 mt-1" />
                  <div>
                    <Label className="text-base">Idioma del Sistema</Label>
                    <p className="text-sm text-slate-500">Idioma principal de la interfaz.</p>
                  </div>
                </div>
                <div className="w-full md:w-[200px]">
                  <Select defaultValue="es">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800" />

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <Moon className="h-5 w-5 text-slate-500 hidden dark:block" />
                    <Sun className="h-5 w-5 text-amber-500 dark:hidden" />
                  </div>
                  <div>
                    <Label className="text-base">Apariencia</Label>
                    <p className="text-sm text-slate-500">Alternar modo claro/oscuro.</p>
                  </div>
                </div>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme('light')}
                    className={cn(
                      "h-7 px-3 rounded-md transition-all",
                      theme === 'light' ? "bg-white shadow-sm text-slate-900" : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    Claro
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className={cn(
                      "h-7 px-3 rounded-md transition-all",
                      theme === 'dark' ? "bg-slate-700 text-white shadow-sm" : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    Oscuro
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </section>

        {/* --- SECURITY SECTION --- */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Seguridad
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña Actual</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={!isEditingPassword}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva Contraseña</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={!isEditingPassword}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!isEditingPassword}
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                {!isEditingPassword ? (
                  <Button
                    onClick={() => setIsEditingPassword(true)}
                    variant="outline"
                  >
                    Editar Contraseña
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => setIsEditingPassword(false)}
                      variant="ghost"
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handlePasswordUpdate}
                      className="btn-airbnb-effect text-white border-0"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Actualizando...' : 'Guardar Cambios'}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>



    </div>
  )
}
