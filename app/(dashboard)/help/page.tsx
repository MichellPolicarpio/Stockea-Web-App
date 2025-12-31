'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle, User, Building2, Package, ClipboardCheck, Users, BarChart3, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function HelpPage() {
  const pathname = usePathname()

  const helpSections = [
    {
      title: 'Dashboard',
      icon: BarChart3,
      content: (
        <div className="space-y-3">
          <p className="text-sm">
            El dashboard principal muestra un resumen general del sistema según tu rol.
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
            <li>Acceso rápido a funciones principales</li>
            <li>Estadísticas y métricas importantes</li>
            <li>Navegación rápida a secciones</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Edificios',
      icon: Building2,
      content: (
        <div className="space-y-3">
          <p className="text-sm">
            Gestiona los edificios y sus departamentos. Solo disponible para administradores.
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
            <li>Ver lista de todos los edificios</li>
            <li>Acceder a detalles de cada edificio</li>
            <li>Ver departamentos por edificio</li>
            <li>Gestionar información de edificios</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Departamentos',
      icon: Package,
      content: (
        <div className="space-y-3">
          <p className="text-sm">
            Accede a los departamentos asignados según tu rol.
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
            <li><strong>Administrador:</strong> Acceso a todos los departamentos</li>
            <li><strong>Propietario:</strong> Solo tus departamentos asignados</li>
            <li><strong>Verificador:</strong> Departamentos asignados para verificar</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Inventario',
      icon: Package,
      content: (
        <div className="space-y-3">
          <p className="text-sm">
            Gestiona los items del inventario de cada departamento.
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
            <li>Ver lista de items por departamento</li>
            <li>Agregar nuevos items (Admin y Propietario)</li>
            <li>Ver estado de cada item</li>
            <li>Consultar detalles y notas</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Inspecciones',
      icon: ClipboardCheck,
      content: (
        <div className="space-y-3">
          <p className="text-sm">
            Realiza y consulta inspecciones de inventario.
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
            <li><strong>Verificador:</strong> Crear nuevas inspecciones</li>
            <li>Evaluar estado de cada item (OK, Problema, Faltante)</li>
            <li>Agregar notas y observaciones</li>
            <li>Ver historial de inspecciones</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Usuarios',
      icon: Users,
      content: (
        <div className="space-y-3">
          <p className="text-sm">
            Gestiona usuarios y asignaciones. Solo disponible para administradores.
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
            <li>Ver lista de usuarios</li>
            <li>Gestionar propietarios y verificadores</li>
            <li>Asignar departamentos a usuarios</li>
            <li>Administrar permisos</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Perfil',
      icon: User,
      content: (
        <div className="space-y-3">
          <p className="text-sm">
            Consulta y gestiona tu información personal.
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
            <li>Ver información de tu cuenta</li>
            <li>Consultar tu rol y permisos</li>
            <li>Ver fecha de registro</li>
          </ul>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <HelpCircle className="h-8 w-8 text-[#0D94B1]" />
          Ayuda
        </h1>
        <p className="text-muted-foreground">
          Guía de uso del Sistema de Inventarios
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roles del Sistema</CardTitle>
          <CardDescription>
            Diferentes niveles de acceso según tu rol
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 text-red-600">Administrador</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Acceso completo</li>
                <li>• Gestión de edificios</li>
                <li>• Gestión de usuarios</li>
                <li>• Todos los reportes</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-600">Propietario</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Sus departamentos</li>
                <li>• Gestión de inventario</li>
                <li>• Ver inspecciones</li>
                <li>• Reportes propios</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 text-green-600">Verificador</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Crear inspecciones</li>
                <li>• Ver inventario (solo lectura)</li>
                <li>• Historial de inspecciones</li>
                <li>• Sin permisos de edición</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {helpSections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-[#0D94B1]" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {section.content}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preguntas Frecuentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">¿Cómo agrego un nuevo item al inventario?</h3>
            <p className="text-sm text-muted-foreground">
              Solo los administradores y propietarios pueden agregar items. Ve al departamento correspondiente, 
              luego a la sección de Inventario y haz clic en "Agregar Item".
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">¿Cómo creo una nueva inspección?</h3>
            <p className="text-sm text-muted-foreground">
              Los verificadores pueden crear inspecciones. Ve al departamento asignado, luego a Inspecciones 
              y haz clic en "Nueva Inspección". Evalúa cada item y guarda los resultados.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">¿Puedo cambiar mi rol?</h3>
            <p className="text-sm text-muted-foreground">
              No, los roles son asignados por el administrador del sistema. Contacta con un administrador 
              si necesitas cambiar tu rol o permisos.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">¿Los datos se guardan permanentemente?</h3>
            <p className="text-sm text-muted-foreground">
              Actualmente el sistema funciona con datos simulados. Los datos se guardan en el navegador 
              pero se perderán al limpiar el almacenamiento local.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


