'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Info, Building2, Package, ClipboardCheck, Users, BarChart3 } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Acerca de</h1>
        <p className="text-muted-foreground">
          Información sobre el Sistema de Inventarios
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Sistema de Inventarios
            </CardTitle>
            <CardDescription>
              Versión 1.0.0
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Descripción</p>
              <p className="text-sm">
                Sistema integral para la gestión de inventarios y verificaciones por edificios y departamentos. 
                Diseñado para facilitar el control y seguimiento de activos en múltiples ubicaciones.
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Desarrollado con</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Next.js 14+ (App Router)</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Radix UI</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Características Principales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-[#0D94B1] mt-0.5" />
                <div>
                  <p className="font-medium">Gestión de Edificios</p>
                  <p className="text-sm text-muted-foreground">
                    Administra múltiples edificios y sus departamentos
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-[#0D94B1] mt-0.5" />
                <div>
                  <p className="font-medium">Control de Inventario</p>
                  <p className="text-sm text-muted-foreground">
                    Registra y gestiona items por departamento
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ClipboardCheck className="h-5 w-5 text-[#0D94B1] mt-0.5" />
                <div>
                  <p className="font-medium">Inspecciones</p>
                  <p className="text-sm text-muted-foreground">
                    Sistema de verificaciones y reportes de estado
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-[#0D94B1] mt-0.5" />
                <div>
                  <p className="font-medium">Roles y Permisos</p>
                  <p className="text-sm text-muted-foreground">
                    Administrador, Propietario y Verificador
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="h-5 w-5 text-[#0D94B1] mt-0.5" />
                <div>
                  <p className="font-medium">Reportes</p>
                  <p className="text-sm text-muted-foreground">
                    Visualización de estadísticas y análisis
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Versión</p>
              <p className="font-medium">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="font-medium">En Desarrollo</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Modo</p>
              <p className="font-medium">Datos Simulados (Mock)</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Última Actualización</p>
              <p className="font-medium">{new Date().toLocaleDateString('es-ES')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


